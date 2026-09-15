export type LangCode = "en" | "fr" | "es" | "hi" | "pa" | "zh";

export const LANGUAGES: Record<
  LangCode,
  {
    label: string;
    sayVoice: string;
    sayLang: string;
    gatherLang: string | null; // null = speech recognition not reliably supported; rely on DTMF
  }
> = {
  en: { label: "English", sayVoice: "Polly.Joanna", sayLang: "en-US", gatherLang: "en-US" },
  fr: { label: "French (Canadian)", sayVoice: "Polly.Chantal", sayLang: "fr-CA", gatherLang: "fr-CA" },
  es: { label: "Spanish", sayVoice: "Polly.Lupe", sayLang: "es-US", gatherLang: "es-US" },
  hi: { label: "Hindi", sayVoice: "Polly.Aditi", sayLang: "hi-IN", gatherLang: "hi-IN" },
  pa: { label: "Punjabi", sayVoice: "Google.pa-IN-Wavenet-A", sayLang: "pa-IN", gatherLang: null },
  zh: { label: "Mandarin Chinese", sayVoice: "Polly.Zhiyu", sayLang: "cmn-CN", gatherLang: "cmn-Hans-CN" },
};

type Strings = {
  greeting: (name: string) => string;
  reminderLine: (description: string) => string;
  askStory: string;
  noResponseFallback: string;
  yesIntro: (prompt: string) => string;
  noThanks: string;
  thankYouRecording: string;
  unrecognizedCaller: string;
  reminderGreeting: (name: string, description: string) => string;
  reminderGoodbye: string;
  yesSpeechPattern: RegExp | null;
  openCheckIn: string;
};

export const STRINGS: Record<LangCode, Strings> = {
  en: {
    greeting: (name) => `Hello ${name}, it's so good to hear from you.`,
    reminderLine: (d) => `You also asked me to remind you: ${d}.`,
    askStory:
      "Would you like to share a story today? Say yes or no, or press 1 for yes, 2 for no.",
    noResponseFallback: "I didn't catch that. We can try again next time. Take care.",
    yesIntro: (p) =>
      `Wonderful. Here's today's question: ${p} Tell me all about it after the beep, and just hang up or stay quiet for a few seconds when you're done.`,
    noThanks: "No problem. Talk again soon. Goodbye.",
    thankYouRecording: "Thank you so much for sharing that. It's saved for your family. Goodbye for now.",
    unrecognizedCaller:
      "Hi there. I don't have a profile matched to this number yet. Please ask your family to sign up for you on the SetHear website. Goodbye for now.",
    reminderGreeting: (name, d) => `Hello ${name}, this is your reminder: ${d}.`,
    reminderGoodbye: "That's all for now. Goodbye.",
    yesSpeechPattern: /\byes\b|yeah|sure|okay|ok\b/i,
    openCheckIn: "So, how are you doing today?",
  },
  fr: {
    greeting: (name) => `Bonjour ${name}, c'est un plaisir de vous entendre.`,
    reminderLine: (d) => `Vous m'avez aussi demandé de vous rappeler : ${d}.`,
    askStory:
      "Aimeriez-vous partager une histoire aujourd'hui? Dites oui ou non, ou appuyez sur 1 pour oui, 2 pour non.",
    noResponseFallback: "Je n'ai pas compris. On peut réessayer la prochaine fois. Prenez soin de vous.",
    yesIntro: (p) =>
      `Merveilleux. Voici la question du jour : ${p} Racontez-moi tout après le bip, et raccrochez ou restez silencieux quelques secondes quand vous aurez terminé.`,
    noThanks: "Pas de problème. On se reparle bientôt. Au revoir.",
    thankYouRecording: "Merci beaucoup d'avoir partagé cela. C'est sauvegardé pour votre famille. Au revoir pour l'instant.",
    unrecognizedCaller:
      "Bonjour. Je n'ai pas de profil associé à ce numéro. Demandez à votre famille de vous inscrire sur le site SetHear. Au revoir pour l'instant.",
    reminderGreeting: (name, d) => `Bonjour ${name}, voici votre rappel : ${d}.`,
    reminderGoodbye: "C'est tout pour l'instant. Au revoir.",
    yesSpeechPattern: /\boui\b|ouais/i,
    openCheckIn: "Alors, comment allez-vous aujourd'hui?",
  },
  es: {
    greeting: (name) => `Hola ${name}, qué gusto escucharte.`,
    reminderLine: (d) => `También me pediste que te recordara: ${d}.`,
    askStory:
      "¿Te gustaría compartir una historia hoy? Di sí o no, o presiona 1 para sí, 2 para no.",
    noResponseFallback: "No entendí bien. Podemos intentarlo la próxima vez. Cuídate mucho.",
    yesIntro: (p) =>
      `Maravilloso. Aquí está la pregunta de hoy: ${p} Cuéntame todo después del pitido, y solo cuelga o guarda silencio unos segundos cuando termines.`,
    noThanks: "No hay problema. Hablamos pronto. Adiós.",
    thankYouRecording: "Muchas gracias por compartir eso. Está guardado para tu familia. Adiós por ahora.",
    unrecognizedCaller:
      "Hola. No tengo un perfil registrado con este número. Pide a tu familia que te inscriba en el sitio web de SetHear. Adiós por ahora.",
    reminderGreeting: (name, d) => `Hola ${name}, este es tu recordatorio: ${d}.`,
    reminderGoodbye: "Eso es todo por ahora. Adiós.",
    yesSpeechPattern: /\bs[ií]\b|claro/i,
    openCheckIn: "Entonces, ¿cómo estás hoy?",
  },
  hi: {
    greeting: (name) => `नमस्ते ${name}, आपकी आवाज़ सुनकर बहुत अच्छा लगा।`,
    reminderLine: (d) => `आपने मुझे यह याद दिलाने को भी कहा था: ${d}।`,
    askStory:
      "क्या आप आज एक कहानी साझा करना चाहेंगे? हाँ या नहीं कहें, या हाँ के लिए 1 और नहीं के लिए 2 दबाएँ।",
    noResponseFallback: "मुझे समझ नहीं आया। हम अगली बार फिर कोशिश करेंगे। अपना ख्याल रखें।",
    yesIntro: (p) =>
      `बहुत बढ़िया। आज का सवाल है: ${p} बीप के बाद मुझे पूरी बात बताएं, और जब पूरा हो जाए तो फ़ोन रख दें या कुछ सेकंड चुप रहें।`,
    noThanks: "कोई बात नहीं। जल्द ही फिर बात होगी। अलविदा।",
    thankYouRecording: "यह साझा करने के लिए बहुत धन्यवाद। यह आपके परिवार के लिए सुरक्षित कर लिया गया है। अभी के लिए अलविदा।",
    unrecognizedCaller:
      "नमस्ते। इस नंबर से जुड़ी कोई प्रोफ़ाइल नहीं मिली। कृपया अपने परिवार से SetHear वेबसाइट पर साइन अप करने को कहें। अभी के लिए अलविदा।",
    reminderGreeting: (name, d) => `नमस्ते ${name}, यह आपकी याद दिलाने वाली बात है: ${d}।`,
    reminderGoodbye: "अभी के लिए बस इतना ही। अलविदा।",
    yesSpeechPattern: /हाँ|हां|ha\b|haan/i,
    openCheckIn: "तो, आज आप कैसे हैं?",
  },
  pa: {
    greeting: (name) => `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${name} ਜੀ, ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣ ਕੇ ਬਹੁਤ ਖੁਸ਼ੀ ਹੋਈ।`,
    reminderLine: (d) => `ਤੁਸੀਂ ਮੈਨੂੰ ਇਹ ਯਾਦ ਦਿਵਾਉਣ ਲਈ ਵੀ ਕਿਹਾ ਸੀ: ${d}।`,
    askStory:
      "ਕੀ ਤੁਸੀਂ ਅੱਜ ਇੱਕ ਕਹਾਣੀ ਸਾਂਝੀ ਕਰਨਾ ਚਾਹੋਗੇ? ਹਾਂ ਲਈ 1 ਦਬਾਓ, ਨਹੀਂ ਲਈ 2 ਦਬਾਓ।",
    noResponseFallback: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਅਸੀਂ ਅਗਲੀ ਵਾਰ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗੇ। ਆਪਣਾ ਖਿਆਲ ਰੱਖੋ।",
    yesIntro: (p) =>
      `ਬਹੁਤ ਵਧੀਆ। ਅੱਜ ਦਾ ਸਵਾਲ ਹੈ: ${p} ਬੀਪ ਤੋਂ ਬਾਅਦ ਮੈਨੂੰ ਸਾਰੀ ਗੱਲ ਦੱਸੋ, ਅਤੇ ਜਦੋਂ ਪੂਰਾ ਹੋ ਜਾਵੇ ਤਾਂ ਫ਼ੋਨ ਰੱਖ ਦਿਓ।`,
    noThanks: "ਕੋਈ ਗੱਲ ਨਹੀਂ। ਜਲਦੀ ਫਿਰ ਗੱਲ ਹੋਵੇਗੀ। ਅਲਵਿਦਾ।",
    thankYouRecording: "ਇਹ ਸਾਂਝਾ ਕਰਨ ਲਈ ਬਹੁਤ ਧੰਨਵਾਦ। ਇਹ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਲਈ ਸੰਭਾਲ ਲਿਆ ਗਿਆ ਹੈ। ਹੁਣ ਲਈ ਅਲਵਿਦਾ।",
    unrecognizedCaller:
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਇਸ ਨੰਬਰ ਨਾਲ ਕੋਈ ਪ੍ਰੋਫਾਈਲ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਪਰਿਵਾਰ ਨੂੰ SetHear ਵੈੱਬਸਾਈਟ ਤੇ ਸਾਈਨ ਅੱਪ ਕਰਨ ਲਈ ਕਹੋ। ਹੁਣ ਲਈ ਅਲਵਿਦਾ।",
    reminderGreeting: (name, d) => `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${name} ਜੀ, ਇਹ ਤੁਹਾਡੀ ਯਾਦ-ਦਹਾਨੀ ਹੈ: ${d}।`,
    reminderGoodbye: "ਹੁਣ ਲਈ ਬੱਸ ਇੰਨਾ ਹੀ। ਅਲਵਿਦਾ।",
    yesSpeechPattern: null, // no reliable Punjabi speech recognition — DTMF is the real signal
    openCheckIn: "ਤਾਂ, ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
  },
  zh: {
    greeting: (name) => `你好 ${name}，很高兴听到你的声音。`,
    reminderLine: (d) => `你还让我提醒你：${d}。`,
    askStory: "你今天想分享一个故事吗？请说是或不是，或按1表示是，按2表示不是。",
    noResponseFallback: "我没听清楚。我们下次再试。请多保重。",
    yesIntro: (p) => `太好了。今天的问题是：${p} 请在提示音后告诉我详情，说完后挂断或保持几秒钟安静即可。`,
    noThanks: "没关系，我们下次再聊。再见。",
    thankYouRecording: "非常感谢你的分享，已经为你的家人保存好了。再见。",
    unrecognizedCaller: "你好，这个号码还没有注册资料。请让你的家人在 SetHear 网站上为你注册。再见。",
    reminderGreeting: (name, d) => `你好 ${name}，这是你的提醒：${d}。`,
    reminderGoodbye: "就这些了，再见。",
    yesSpeechPattern: /是|好的|要|可以/,
    openCheckIn: "那么，你今天怎么样？",
  },
};

export const STORY_PROMPTS_I18N: Record<LangCode, { theme: string; question: string }[]> = {
  en: [
    { theme: "Childhood", question: "What is your earliest happy memory?" },
    { theme: "Childhood", question: "What was your childhood home like?" },
    { theme: "Love", question: "How did you meet your spouse or partner?" },
    { theme: "Love", question: "What was your wedding day like?" },
    { theme: "Journey", question: "What was it like moving to a new place or country?" },
    { theme: "Career", question: "What was your first job, and what did you learn from it?" },
    { theme: "Parenting", question: "What is your favourite memory of raising your children?" },
    { theme: "History", question: "What historical event do you remember living through?" },
    { theme: "Recipe", question: "What is a family recipe you want passed down?" },
    { theme: "Humour", question: "What is the funniest thing that ever happened to you?" },
    { theme: "Wisdom", question: "What is the most important lesson life has taught you?" },
    { theme: "Legacy", question: "What do you hope your grandchildren remember about you?" },
  ],
  fr: [
    { theme: "Enfance", question: "Quel est votre premier souvenir heureux?" },
    { theme: "Enfance", question: "À quoi ressemblait la maison de votre enfance?" },
    { theme: "Amour", question: "Comment avez-vous rencontré votre conjoint ou partenaire?" },
    { theme: "Amour", question: "Comment s'est déroulé votre mariage?" },
    { theme: "Voyage", question: "Comment était-ce de déménager dans un nouvel endroit ou pays?" },
    { theme: "Carrière", question: "Quel était votre premier emploi, et qu'en avez-vous appris?" },
    { theme: "Parentalité", question: "Quel est votre plus beau souvenir d'avoir élevé vos enfants?" },
    { theme: "Histoire", question: "Quel événement historique avez-vous vécu?" },
    { theme: "Recette", question: "Quelle recette de famille voulez-vous transmettre?" },
    { theme: "Humour", question: "Quelle est la chose la plus drôle qui vous soit arrivée?" },
    { theme: "Sagesse", question: "Quelle est la leçon la plus importante que la vie vous a apprise?" },
    { theme: "Héritage", question: "Que souhaitez-vous que vos petits-enfants se souviennent de vous?" },
  ],
  es: [
    { theme: "Infancia", question: "¿Cuál es tu primer recuerdo feliz?" },
    { theme: "Infancia", question: "¿Cómo era la casa de tu infancia?" },
    { theme: "Amor", question: "¿Cómo conociste a tu esposo o pareja?" },
    { theme: "Amor", question: "¿Cómo fue el día de tu boda?" },
    { theme: "Viaje", question: "¿Cómo fue mudarte a un nuevo lugar o país?" },
    { theme: "Carrera", question: "¿Cuál fue tu primer trabajo, y qué aprendiste de él?" },
    { theme: "Crianza", question: "¿Cuál es tu recuerdo favorito de criar a tus hijos?" },
    { theme: "Historia", question: "¿Qué evento histórico recuerdas haber vivido?" },
    { theme: "Receta", question: "¿Cuál es una receta familiar que quieres transmitir?" },
    { theme: "Humor", question: "¿Cuál es lo más gracioso que te ha pasado?" },
    { theme: "Sabiduría", question: "¿Cuál es la lección más importante que te ha enseñado la vida?" },
    { theme: "Legado", question: "¿Qué esperas que tus nietos recuerden de ti?" },
  ],
  hi: [
    { theme: "बचपन", question: "आपकी सबसे पहली खुशी की याद क्या है?" },
    { theme: "बचपन", question: "आपका बचपन का घर कैसा था?" },
    { theme: "प्रेम", question: "आप अपने जीवनसाथी से कैसे मिले?" },
    { theme: "प्रेम", question: "आपकी शादी का दिन कैसा था?" },
    { theme: "यात्रा", question: "किसी नई जगह या देश में जाना कैसा अनुभव था?" },
    { theme: "करियर", question: "आपकी पहली नौकरी क्या थी, और आपने उससे क्या सीखा?" },
    { theme: "पालन-पोषण", question: "अपने बच्चों को पालने की आपकी सबसे प्रिय याद क्या है?" },
    { theme: "इतिहास", question: "आपने कौन सी ऐतिहासिक घटना अपनी आँखों से देखी?" },
    { theme: "रेसिपी", question: "कौन सी पारिवारिक रेसिपी आप आगे बढ़ाना चाहते हैं?" },
    { theme: "हास्य", question: "आपके साथ हुई सबसे मज़ेदार बात क्या है?" },
    { theme: "ज्ञान", question: "जीवन ने आपको सबसे महत्वपूर्ण सबक क्या सिखाया?" },
    { theme: "विरासत", question: "आप चाहते हैं कि आपके पोते-पोतियां आपको कैसे याद रखें?" },
  ],
  pa: [
    { theme: "ਬਚਪਨ", question: "ਤੁਹਾਡੀ ਸਭ ਤੋਂ ਪੁਰਾਣੀ ਖੁਸ਼ੀ ਦੀ ਯਾਦ ਕੀ ਹੈ?" },
    { theme: "ਬਚਪਨ", question: "ਤੁਹਾਡਾ ਬਚਪਨ ਦਾ ਘਰ ਕਿਹੋ ਜਿਹਾ ਸੀ?" },
    { theme: "ਪਿਆਰ", question: "ਤੁਸੀਂ ਆਪਣੇ ਜੀਵਨ ਸਾਥੀ ਨੂੰ ਕਿਵੇਂ ਮਿਲੇ?" },
    { theme: "ਪਿਆਰ", question: "ਤੁਹਾਡੇ ਵਿਆਹ ਦਾ ਦਿਨ ਕਿਹੋ ਜਿਹਾ ਸੀ?" },
    { theme: "ਸਫ਼ਰ", question: "ਕਿਸੇ ਨਵੀਂ ਜਗ੍ਹਾ ਜਾਂ ਦੇਸ਼ ਵਿੱਚ ਜਾਣਾ ਕਿਹੋ ਜਿਹਾ ਸੀ?" },
    { theme: "ਕਰੀਅਰ", question: "ਤੁਹਾਡੀ ਪਹਿਲੀ ਨੌਕਰੀ ਕੀ ਸੀ, ਅਤੇ ਤੁਸੀਂ ਇਸ ਤੋਂ ਕੀ ਸਿੱਖਿਆ?" },
    { theme: "ਪਾਲਣ-ਪੋਸ਼ਣ", question: "ਆਪਣੇ ਬੱਚਿਆਂ ਨੂੰ ਪਾਲਣ ਦੀ ਤੁਹਾਡੀ ਮਨਪਸੰਦ ਯਾਦ ਕੀ ਹੈ?" },
    { theme: "ਇਤਿਹਾਸ", question: "ਤੁਸੀਂ ਕਿਹੜੀ ਇਤਿਹਾਸਕ ਘਟਨਾ ਆਪਣੀਆਂ ਅੱਖਾਂ ਨਾਲ ਵੇਖੀ?" },
    { theme: "ਪਕਵਾਨ", question: "ਕਿਹੜਾ ਪਰਿਵਾਰਕ ਪਕਵਾਨ ਤੁਸੀਂ ਅੱਗੇ ਵਧਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?" },
    { theme: "ਹਾਸਾ", question: "ਤੁਹਾਡੇ ਨਾਲ ਹੋਈ ਸਭ ਤੋਂ ਮਜ਼ਾਕੀਆ ਗੱਲ ਕੀ ਹੈ?" },
    { theme: "ਸਿਆਣਪ", question: "ਜ਼ਿੰਦਗੀ ਨੇ ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਸਬਕ ਕੀ ਸਿਖਾਇਆ?" },
    { theme: "ਵਿਰਾਸਤ", question: "ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਤੁਹਾਡੇ ਪੋਤੇ-ਪੋਤੀਆਂ ਤੁਹਾਨੂੰ ਕਿਵੇਂ ਯਾਦ ਰੱਖਣ?" },
  ],
  zh: [
    { theme: "童年", question: "你最早的快乐回忆是什么？" },
    { theme: "童年", question: "你童年的家是什么样子的？" },
    { theme: "爱情", question: "你是怎么认识你的伴侣的？" },
    { theme: "爱情", question: "你的婚礼是怎样的？" },
    { theme: "旅程", question: "搬到一个新地方或新国家是什么感觉？" },
    { theme: "事业", question: "你的第一份工作是什么，你从中学到了什么？" },
    { theme: "育儿", question: "养育孩子时你最喜欢的回忆是什么？" },
    { theme: "历史", question: "你亲身经历过哪个历史事件？" },
    { theme: "食谱", question: "有什么家庭食谱你想传下去？" },
    { theme: "幽默", question: "你经历过最有趣的事情是什么？" },
    { theme: "智慧", question: "人生教会你最重要的一课是什么？" },
    { theme: "传承", question: "你希望你的孙辈记住你什么？" },
  ],
};

export function pickPrompt(lang: LangCode) {
  const prompts = STORY_PROMPTS_I18N[lang] || STORY_PROMPTS_I18N.en;
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function detectYes(lang: LangCode, digits: string, speech: string): boolean | null {
  if (digits === "1") return true;
  if (digits === "2") return false;

  const pattern = STRINGS[lang]?.yesSpeechPattern;
  if (!pattern) return null;
  return pattern.test(speech) ? true : null;
}

export function langOf(code: string | null | undefined): LangCode {
  return code && code in LANGUAGES ? (code as LangCode) : "en";
}
