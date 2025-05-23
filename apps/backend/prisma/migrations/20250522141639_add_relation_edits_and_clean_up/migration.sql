/*
  Warnings:

  - You are about to drop the `Launchpad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Launchpad" DROP CONSTRAINT "Launchpad_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectUser" DROP CONSTRAINT "ProjectUser_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectUser" DROP CONSTRAINT "ProjectUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tile" DROP CONSTRAINT "Tile_launchpadId_fkey";

-- DropForeignKey
ALTER TABLE "TtnDeviceDetail" DROP CONSTRAINT "TtnDeviceDetail_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "TtnDeviceDetail" DROP CONSTRAINT "TtnDeviceDetail_ttnProviderId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "deviceParameters" DROP CONSTRAINT "deviceParameters_deviceId_fkey";

-- DropTable
DROP TABLE "Launchpad";

-- DropTable
DROP TABLE "Tile";

-- DropTable
DROP TABLE "Video";

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deviceParameters" ADD CONSTRAINT "deviceParameters_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TtnDeviceDetail" ADD CONSTRAINT "TtnDeviceDetail_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TtnDeviceDetail" ADD CONSTRAINT "TtnDeviceDetail_ttnProviderId_fkey" FOREIGN KEY ("ttnProviderId") REFERENCES "TtnProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
