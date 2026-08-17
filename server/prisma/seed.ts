import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { icon: "🦆", name: "Rubber Duck", description: "Squeaks. Judges your code. Floats.", priceTokens: 25 },
  { icon: "📼", name: "Mixtape", description: "90 minutes of pure, rewindable vibes.", priceTokens: 35 },
  { icon: "🕶️", name: "Pixel Shades", description: "8-bit UV protection. Deal with it.", priceTokens: 45 },
  { icon: "🎁", name: "Mystery Box", description: "Could be treasure. Could be socks.", priceTokens: 60 },
  { icon: "🪔", name: "Lava Lamp", description: "Certified mood. Ambient wobble included.", priceTokens: 90 },
  { icon: "🪩", name: "Disco Ball", description: "Turns any room into a Saturday night.", priceTokens: 120 },
  { icon: "🧸", name: "Giant Teddy", description: "The big one. The one everyone wants.", priceTokens: 150 },
  { icon: "🤖", name: "Robot Buddy", description: "Beeps supportively. Never files a bug.", priceTokens: 175 },
  { icon: "🛹", name: "Skateboard", description: "Grip tape, good wheels, questionable ollies.", priceTokens: 200 },
];

async function main() {
  // Reset in dependency order.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.wallet.deleteMany();

  await prisma.product.createMany({ data: products });
  await prisma.wallet.create({ data: { balance: 300 } });

  console.log(`Seeded ${products.length} products and 1 wallet (300 tokens).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
