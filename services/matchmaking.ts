import { pushData, updateData, readOnce, findMatchmakingByComposite } from "@/lib/firebase-db"
import { dbRef, writeData } from "@/lib/firebase-db"
import { MatchmakingEntry } from "@/lib/firebase-types"

function normalizeAddress(a: string) {
  return a.toLowerCase()
}

export async function createMatchmakingEntry(address: string, gameType: string, stake: number) {
  const playerAddress = normalizeAddress(address)
  const entry: MatchmakingEntry = {
    playerAddress,
    gameType: gameType as any,
    stake: Number(stake.toFixed(2)),
    gameTypeStake: `${gameType}#${Number(stake).toFixed(2)}`,
    timestamp: Date.now(),
    status: "waiting",
  }
  const key = await pushData("matchmakingQueue", entry)
  return { key, entry }
}

export async function findPotentialMatches(gameType: string, stake: number) {
  const composite = `${gameType}#${Number(stake).toFixed(2)}`
  const results = await findMatchmakingByComposite(composite)
  return results
}

export async function markEntryMatched(entryKey: string, otherKey?: string) {
  const updates: Record<string, any> = {}
  updates[`matchmakingQueue/${entryKey}/status`] = "matched"
  if (otherKey) updates[`matchmakingQueue/${otherKey}/status`] = "matched"
  await updateData("/", updates)
}
