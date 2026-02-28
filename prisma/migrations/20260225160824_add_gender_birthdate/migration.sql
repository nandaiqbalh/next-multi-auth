-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Prefer_not_to_say');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthdate" TEXT,
ADD COLUMN     "gender" "Gender";
