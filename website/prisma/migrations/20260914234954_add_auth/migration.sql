/*
  Warnings:

  - Added the required column `userId` to the `SeniorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "lastSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SeniorProfile" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "capturedVia" TEXT NOT NULL DEFAULT 'web',
ADD COLUMN     "recordingUrl" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SeniorProfile_seniorPhone_idx" ON "SeniorProfile"("seniorPhone");

-- AddForeignKey
ALTER TABLE "SeniorProfile" ADD CONSTRAINT "SeniorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
