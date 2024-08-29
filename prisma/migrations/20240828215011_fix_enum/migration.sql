/*
  Warnings:

  - Changed the type of `measure_type` on the `measure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- AlterTable
ALTER TABLE "measure" DROP COLUMN "measure_type",
ADD COLUMN     "measure_type" "MeasureType" NOT NULL;
