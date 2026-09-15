-- CreateTable
CREATE TABLE "MemoryItem" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemoryItem_seniorId_item_idx" ON "MemoryItem"("seniorId", "item");

-- AddForeignKey
ALTER TABLE "MemoryItem" ADD CONSTRAINT "MemoryItem_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "SeniorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
