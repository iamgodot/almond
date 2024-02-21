-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
