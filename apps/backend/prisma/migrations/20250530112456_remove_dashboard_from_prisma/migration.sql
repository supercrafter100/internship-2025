/*
  Warnings:

  - You are about to drop the `Dashboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dashboard" DROP CONSTRAINT "Dashboard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_projectId_fkey";

-- DropTable
DROP TABLE "Dashboard";

-- DropEnum
DROP TYPE "DashboardType";

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
