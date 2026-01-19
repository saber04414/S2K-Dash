-- CreateTable
CREATE TABLE "MyEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MyEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "sender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientEmail_pkey" PRIMARY KEY ("id")
);
