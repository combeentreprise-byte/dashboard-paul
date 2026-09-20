import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.bill.create({
    data: {
      invoiceNumber: "260141",
      date: new Date("2026-07-23"),
      client: "DOMCA S.A.U.",
      direction: "OUTGOING",
      currency: "EUR",
      total: 29830.0,
      products: {
        create: [
          { productName: "Food FL2 IBC", quantity: 1, pricePaid: 16850.0 },
          { productName: "Food FL1 IBC", quantity: 2, pricePaid: 6490.0 },
        ],
      },
    },
  });

  await prisma.bill.create({
    data: {
      invoiceNumber: "INV-0042",
      date: new Date("2026-06-01"),
      client: "Acme Supplies Ltd.",
      direction: "INCOMING",
      currency: "EUR",
      total: 540.0,
      products: {
        create: [
          { productName: "Office chairs", quantity: 2, pricePaid: 220.0 },
          { productName: "Shipping", quantity: 1, pricePaid: 100.0 },
        ],
      },
    },
  });

  console.log("Seeded 2 placeholder bills.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
