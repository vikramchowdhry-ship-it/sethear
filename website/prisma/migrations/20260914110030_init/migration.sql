-- CreateTable
CREATE TABLE "SeniorProfile" (
    "id" TEXT NOT NULL,
    "seniorName" TEXT NOT NULL,
    "seniorPhone" TEXT NOT NULL,
    "preferredCallTime" TEXT NOT NULL,
    "faithPreference" TEXT,
    "familyName" TEXT NOT NULL,
    "familyPhone" TEXT NOT NULL,
    "familyEmail" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "notes" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeniorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StoryTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StoryTags_AB_unique" ON "_StoryTags"("A", "B");

-- CreateIndex
CREATE INDEX "_StoryTags_B_index" ON "_StoryTags"("B");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "SeniorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "SeniorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "SeniorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryTags" ADD CONSTRAINT "_StoryTags_A_fkey" FOREIGN KEY ("A") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryTags" ADD CONSTRAINT "_StoryTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
