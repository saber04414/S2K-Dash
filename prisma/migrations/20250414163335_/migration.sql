-- CreateTable
CREATE TABLE "Protein" (
    "id" SERIAL NOT NULL,
    "protein" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Protein_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "protein" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "product" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Synth" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "sigma" DOUBLE PRECISION NOT NULL,
    "dt" DOUBLE PRECISION NOT NULL,
    "flag" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Synth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coldkey" (
    "id" SERIAL NOT NULL,
    "coldkey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coldkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subnets" (
    "id" SERIAL NOT NULL,
    "subnet" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subnets_pkey" PRIMARY KEY ("id")
);
