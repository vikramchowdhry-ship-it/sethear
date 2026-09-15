-- CreateTable
CREATE TABLE "CallSession" (
    "id" TEXT NOT NULL,
    "callSid" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "turns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallSession_callSid_key" ON "CallSession"("callSid");

-- AddForeignKey
ALTER TABLE "CallSession" ADD CONSTRAINT "CallSession_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "SeniorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
