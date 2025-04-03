/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `protocol` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ProjectUser` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Tile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,userId]` on the table `ProjectUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceParameters` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceType` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgKey` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `latitude` on the `Device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `longitude` on the `Device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `imgKey` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin` to the `ProjectUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgKey` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_deviceId_fkey";

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
DROP COLUMN "image",
DROP COLUMN "protocol",
DROP COLUMN "type",
ADD COLUMN     "description" VARCHAR(500) NOT NULL,
ADD COLUMN     "deviceParameters" JSONB NOT NULL,
ADD COLUMN     "deviceType" TEXT NOT NULL,
ADD COLUMN     "imgKey" VARCHAR(255) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
DROP COLUMN "longitude",
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Device_id_seq";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "imgKey" VARCHAR(255) NOT NULL,
ADD COLUMN     "shortDescription" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "ProjectUser" DROP COLUMN "role",
ADD COLUMN     "admin" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Tile" DROP COLUMN "img",
ADD COLUMN     "imgKey" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "deviceId" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "DeviceType";

-- DropEnum
DROP TYPE "Protocol";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectUser_projectId_userId_key" ON "ProjectUser"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
