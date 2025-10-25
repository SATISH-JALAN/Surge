import { readOnce, writeData, updateData, pushData } from "@/lib/firebase-db"
import { PlayerProfile } from "@/lib/firebase-types"

function normalizeAddress(a: string) {
  return a.toLowerCase()
}

export async function getPlayer(address: string) {
  const addr = normalizeAddress(address)
  const data = await readOnce(`players/${addr}`)
  return data as PlayerProfile | null
}

export async function createOrUpdatePlayer(address: string, profile: Partial<PlayerProfile>) {
  const addr = normalizeAddress(address)
  const now = Date.now()
  const existing = await getPlayer(addr)
  if (!existing) {
    const p: PlayerProfile = {
      address: addr,
      username: profile.username || addr.slice(0, 8),
      wins: profile.wins || 0,
      losses: profile.losses || 0,
      totalEarnings: profile.totalEarnings || 0,
      createdAt: now,
      lastActive: now,
    }
    await writeData(`players/${addr}`, p)
    return p
  }
  const updates: any = { lastActive: now }
  if (typeof profile.username === "string") updates.username = profile.username
  if (typeof profile.wins === "number") updates.wins = profile.wins
  if (typeof profile.losses === "number") updates.losses = profile.losses
  if (typeof profile.totalEarnings === "number") updates.totalEarnings = profile.totalEarnings
  await updateData(`players/${addr}`, updates)
  return await getPlayer(addr)
}

export async function updatePlayerStats(address: string, isWinner: boolean, reward = 0) {
  const addr = normalizeAddress(address)
  const data = await getPlayer(addr)
  if (!data) {
    const p: PlayerProfile = {
      address: addr,
      username: addr.slice(0, 8),
      wins: isWinner ? 1 : 0,
      losses: isWinner ? 0 : 1,
      totalEarnings: isWinner ? Number(reward.toFixed(2)) : 0,
      createdAt: Date.now(),
      lastActive: Date.now(),
    }
    await writeData(`players/${addr}`, p)
    return p
  }
  const updates: any = { lastActive: Date.now() }
  if (isWinner) updates.wins = (data.wins || 0) + 1
  else updates.losses = (data.losses || 0) + 1
  if (reward) updates.totalEarnings = Number(((data.totalEarnings || 0) + reward).toFixed(2))
  await updateData(`players/${addr}`, updates)
  return await getPlayer(addr)
}
