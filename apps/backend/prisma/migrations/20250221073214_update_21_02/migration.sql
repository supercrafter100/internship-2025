/*
  Warnings:

  - You are about to drop the column `geoLocation` on the `Device` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dashboard" ALTER COLUMN "preset" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "geoLocation",
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
