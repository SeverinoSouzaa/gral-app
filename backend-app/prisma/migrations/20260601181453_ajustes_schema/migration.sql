/*
  Warnings:

  - Changed the type of `tipo_documento` on the `documentos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `event_type` to the `eventos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('FRAME_PHOTO', 'CAP_NAME', 'OTHER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('EVENT', 'REHEARSAL', 'DEADLINE');

-- AlterTable
ALTER TABLE "documentos" DROP COLUMN "tipo_documento",
ADD COLUMN     "tipo_documento" "DocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "event_type" "EventType" NOT NULL;

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);
