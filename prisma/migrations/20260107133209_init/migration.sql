/*
  Warnings:

  - Added the required column `businessType` to the `shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rePassword` to the `shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuman` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('MCHJ', 'YTT', 'SELF_EMPLOYED');

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "businessType" "BusinessType" NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "rePassword" TEXT NOT NULL,
ADD COLUMN     "tuman" TEXT NOT NULL;
