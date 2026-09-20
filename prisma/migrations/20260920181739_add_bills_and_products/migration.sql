-- CreateEnum
CREATE TYPE "BillDirection" AS ENUM ('OUTGOING', 'INCOMING');

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "direction" "BillDirection" NOT NULL,
    "currency" TEXT NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "pricePaid" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_invoiceNumber_client_key" ON "Bill"("invoiceNumber", "client");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
