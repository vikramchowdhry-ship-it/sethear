import Anthropic from "@anthropic-ai/sdk";
import { LangCode, LANGUAGES } from "@/lib/i18n";

const MODEL = "claude-haiku-4-5-20251001"; // fast, low-latency — matters for phone conversation
const MAX_TURNS = 12;

export function aiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

type ChatMessage = { role: "user" | "assistant"; content: string };
type MemoryFact = { item: string; location: string };

type ConverseResult = {
  reply: string;
  endCall: boolean;
  emergency: boolean;
  savedStory: { prompt: string; answer: string } | null;
  savedMemory: MemoryFact | null;
};

const EMERGENCY_MESSAGE: Record<LangCode, string> = {
  en: "I want to connect you with people trained for this right now. Please hang up and call 911, or call or text 988 for the Suicide and Crisis Lifeline.",
  fr: "Je veux vous mettre en contact avec des gens formés pour cela dès maintenant. Raccrochez et appelez le 911, ou composez le 988 pour la ligne de crise.",
  es: "Quiero conectarte con personas capacitadas para esto ahora mismo. Cuelga y llama al 911, o llama o envía un mensaje de texto al 988.",
  hi: "मैं अभी आपको इसके लिए प्रशिक्षित लोगों से जोड़ना चाहता हूँ। कृपया फ़ोन रखें और 911 पर कॉल करें।",
  pa: "ਮੈਂ ਹੁਣੇ ਤੁਹਾਨੂੰ ਇਸ ਲਈ ਸਿਖਲਾਈ ਪ੍ਰਾਪਤ ਲੋਕਾਂ ਨਾਲ ਜੋੜਨਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਫ਼ੋਨ ਰੱਖੋ ਅਤੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
  zh: "我现在想帮你联系受过专业训练的人。请挂断电话并拨打911求助。",
};

function systemPrompt(
  seniorName: string,
  lang: LangCode,
  remindersRead: string[],
  memories: MemoryFact[],
) {
  const langLabel = LANGUAGES[lang].label;
  const memoryList = memories.length
    ? memories.map((m) => `${m.item}: ${m.location}`).join("; ")
    : "nothing saved yet";

  return `You are the voice of SetHear, a warm daily phone-call companion for ${seniorName}, an older adult who lives alone. This is a live phone call — keep every reply SHORT (1-3 sentences), warm, and conversational, like a caring friend, never like an assistant or chatbot.

Respond ONLY in ${langLabel}, regardless of what language the input is in.

Today's reminders already read to them: ${remindersRead.length ? remindersRead.join("; ") : "none"}.

Things they've previously asked you to remember (item: location): ${memoryList}.

Rules, no exceptions:
- Never give medical, mental health, legal, or financial advice. If asked, gently say you're not able to help with that and suggest they ask their doctor or a trusted family member.
- Never diagnose memory loss, dementia, or any condition.
- If they mention self-harm, suicide, wanting to die, or a medical emergency (chest pain, can't breathe, fell and hurt themselves, etc.), you MUST call the flag_emergency tool immediately instead of replying normally. Do not try to handle it yourself.
- If they share a meaningful personal story, memory, or piece of family history, call the save_story tool with a short question-style title and their story in their own words (translated to English for storage, but keep the SPOKEN reply to them in ${langLabel}).
- If they tell you where they keep something (e.g. "my glasses are on the kitchen table"), read it back to confirm, then call the remember_item tool. Never save something you didn't clearly hear confirmed.
- If they ask where something is, answer ONLY from the list above. If it's not on the list, say honestly that you don't have that saved yet — never guess or invent a location.
- When the conversation naturally winds down (they say goodbye, they're busy, or the chat feels complete), call the end_call tool.
- Keep the conversation itself light: ask about their day, invite them to share a memory or story if it feels natural, chat warmly. Never be repetitive.`;
}

const tools: Anthropic.Tool[] = [
  {
    name: "flag_emergency",
    description:
      "Call this immediately if the caller mentions self-harm, suicide, or a medical emergency. This overrides your normal reply.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "save_story",
    description: "Save a meaningful personal story or memory the caller just shared.",
    input_schema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "A short question-style title for the story, in English" },
        answer: { type: "string", description: "The story itself, in the caller's own words, in English" },
      },
      required: ["prompt", "answer"],
    },
  },
  {
    name: "remember_item",
    description: "Save where the caller keeps a specific item, after reading it back to confirm.",
    input_schema: {
      type: "object",
      properties: {
        item: { type: "string", description: "The item, in English, e.g. 'glasses'" },
        location: { type: "string", description: "Where it's kept, in English, e.g. 'kitchen table'" },
      },
      required: ["item", "location"],
    },
  },
  {
    name: "end_call",
    description: "Call this when the conversation has naturally concluded and it's time to say goodbye.",
    input_schema: { type: "object", properties: {} },
  },
];

export async function converse(
  history: ChatMessage[],
  seniorName: string,
  lang: LangCode,
  remindersRead: string[],
  memories: MemoryFact[],
  turnCount: number,
): Promise<ConverseResult> {
  if (turnCount >= MAX_TURNS) {
    return { reply: "", endCall: true, emergency: false, savedStory: null, savedMemory: null };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system = systemPrompt(seniorName, lang, remindersRead, memories);

  let messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let savedStory: { prompt: string; answer: string } | null = null;
  let savedMemory: MemoryFact | null = null;

  for (let i = 0; i < 3; i++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system,
      messages,
      tools,
    });

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );

    const emergencyCalled = toolUses.some((t) => t.name === "flag_emergency");
    if (emergencyCalled) {
      return { reply: EMERGENCY_MESSAGE[lang], endCall: true, emergency: true, savedStory, savedMemory };
    }

    const endCalled = toolUses.some((t) => t.name === "end_call");

    const storyTool = toolUses.find((t) => t.name === "save_story");
    if (storyTool) {
      const input = storyTool.input as { prompt?: string; answer?: string };
      if (input.prompt && input.answer) {
        savedStory = { prompt: input.prompt, answer: input.answer };
      }
    }

    const memoryTool = toolUses.find((t) => t.name === "remember_item");
    if (memoryTool) {
      const input = memoryTool.input as { item?: string; location?: string };
      if (input.item && input.location) {
        savedMemory = { item: input.item, location: input.location };
      }
    }

    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      const reply = textBlocks.map((b) => b.text).join(" ").trim();
      return { reply, endCall: endCalled, emergency: false, savedStory, savedMemory };
    }

    // Tool was used but Claude has more to say — feed tool results back and continue.
    messages = [
      ...messages,
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: toolUses.map((t) => ({
          type: "tool_result" as const,
          tool_use_id: t.id,
          content: "ok",
        })),
      },
    ];

    if (endCalled) {
      const reply = textBlocks.map((b) => b.text).join(" ").trim();
      return { reply, endCall: true, emergency: false, savedStory, savedMemory };
    }
  }

  return { reply: "", endCall: true, emergency: false, savedStory, savedMemory };
}
