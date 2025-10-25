import { readOnce, transactionIncrement, writeData } from "@/lib/firebase-db"

export async function incrementGamesPlayed(delta = 1) {
  await transactionIncrement("platformStats/totalGamesPlayed", delta)
}

export async function incrementRevenue(amount = 0) {
  // amount in currency units
  const cur = (await readOnce("platformStats/totalRevenue")) || 0
  const next = Number((Number(cur) + Number(amount)).toFixed(2))
  await writeData("platformStats/totalRevenue", next)
}

export async function setDailyActiveUsers(n: number) {
  await writeData("platformStats/dailyActiveUsers", n)
}
