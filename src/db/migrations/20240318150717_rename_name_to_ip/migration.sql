/*
  Warnings:

  - You are about to drop the column `name` on the `counts` table. All the data in the column will be lost.
  - Added the required column `ip` to the `counts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "counts" DROP COLUMN "name",
ADD COLUMN     "ip" VARCHAR(50) NOT NULL;
