import { prisma } from "./prisma";

// Returns the single wallet, creating it with a starting balance if missing.
export async function getWallet() {
  let wallet = await prisma.wallet.findFirst();
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { balance: 300 } });
  }
  return wallet;
}
