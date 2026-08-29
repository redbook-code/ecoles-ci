-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('MATERNELLE', 'PRIMAIRE', 'COLLEGE', 'LYCEE', 'PROFESSIONNEL', 'UNIVERSITE');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('PUBLIC', 'PRIVE');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('PUBLIQUE', 'ETABLISSEMENT');

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SchoolType" NOT NULL,
    "status" "SchoolStatus" NOT NULL,
    "description" TEXT,
    "foundedYear" INTEGER,
    "classCount" INTEGER,
    "studentCount" INTEGER,
    "languages" TEXT[],
    "cityId" TEXT NOT NULL,
    "communeId" TEXT,
    "neighborhood" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "website" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "coverImageUrl" TEXT,
    "logoUrl" TEXT,
    "source" "DataSource" NOT NULL DEFAULT 'PUBLIQUE',
    "sourceUrl" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolPhoto" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SchoolPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolProgram" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "SchoolProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolFee" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "registrationFee" INTEGER,
    "tuitionFee" INTEGER,
    "otherFees" INTEGER,
    "schoolYear" TEXT NOT NULL,

    CONSTRAINT "SchoolFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolFacility" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SchoolFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolReview" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolNews" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolEvent" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE INDEX "City_name_idx" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "School_name_idx" ON "School"("name");

-- CreateIndex
CREATE INDEX "School_type_status_idx" ON "School"("type", "status");

-- CreateIndex
CREATE INDEX "School_cityId_idx" ON "School"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_schoolId_key" ON "VerificationRequest"("schoolId");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPhoto" ADD CONSTRAINT "SchoolPhoto_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolProgram" ADD CONSTRAINT "SchoolProgram_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolFee" ADD CONSTRAINT "SchoolFee_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolFacility" ADD CONSTRAINT "SchoolFacility_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolReview" ADD CONSTRAINT "SchoolReview_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolNews" ADD CONSTRAINT "SchoolNews_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolEvent" ADD CONSTRAINT "SchoolEvent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
