-- CreateTable

CREATE TABLE
    "User" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "userCode" INTEGER NOT NULL,
        "name" TEXT NOT NULL DEFAULT '',
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'ユーザー',
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

-- CreateTable

CREATE TABLE
    "Customer" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "name" TEXT,
        "kana" TEXT,
        CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
    );

-- CreateTable

CREATE TABLE
    "Service" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "name" TEXT NOT NULL,
        "moldType" TEXT NOT NULL,
        "price" INTEGER NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "customerId" INTEGER,
        "formId" TEXT NOT NULL,
        "answeredAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
    );

-- CreateTable

CREATE TABLE
    "Review" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "serviceId" INTEGER NOT NULL,
        CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex

CREATE UNIQUE INDEX "User_userCode_key" ON "User"("userCode");

-- CreateIndex

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex

CREATE UNIQUE INDEX "Service_formId_key" ON "Service"("formId");

-- AddForeignKey

ALTER TABLE "Service"
ADD
    CONSTRAINT "Service_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "Review"
ADD
    CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
