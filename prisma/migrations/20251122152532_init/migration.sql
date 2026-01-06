-- CreateTable
CREATE TABLE "BusyMasters" (
    "id" TEXT NOT NULL,
    "masterId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusyMasters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusyMasters" ADD CONSTRAINT "BusyMasters_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
