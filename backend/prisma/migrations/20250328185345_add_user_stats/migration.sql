/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activityData" JSONB,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "fileTypeStats" JSONB,
ADD COLUMN     "filesDeleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "filesDownloaded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "filesUploaded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "totalStorage" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usedStorage" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
