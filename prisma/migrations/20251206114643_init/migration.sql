-- CreateTable
CREATE TABLE "Advert" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "serverLink" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,

    CONSTRAINT "Advert_pkey" PRIMARY KEY ("id")
);
