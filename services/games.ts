import { pushData, writeData, readOnce, updateData } from "@/lib/firebase-db"
import { createMatchmakingEntry } from "@/services/matchmaking"
import { addMatchForPlayers } from "@/services/matchHistory"
import { updatePlayerStats } from "@/services/players"
import { GameRecord } from "@/lib/firebase-types"

function normalizeAddress(a: string) {
  return a.toLowerCase()
}

export async function createGame(player1: string, player2: string, gameType: string, stake: number) {
  const p1 = normalizeAddress(player1)
  const p2 = normalizeAddress(player2)
  const game: GameRecord = {
    player1: p1,
    player2: p2,
    gameType: gameType as any,
    startTime: Date.now(),
    stakes: { player1Stake: Number(stake.toFixed(2)), player2Stake: Number(stake.toFixed(2)) },
    status: "active",
  }
  const key = await pushData("games", game)
  await writeData(`games/${key}/id`, key)
  return { key, game }
}

export async function finishGame(gameId: string, winnerAddress: string, player1Score?: number, player2Score?: number) {
  const game = await readOnce(`games/${gameId}`)
  if (!game) throw new Error("game not found")

  // normalize fields we read from DB
  const p1 = normalizeAddress(game.player1 || game.player1Address || "")
  const p2 = normalizeAddress(game.player2 || game.player2Address || "")

  const winner = normalizeAddress(winnerAddress)

  // guard: ensure winner is one of the players
  if (winner !== p1 && winner !== p2) {
    throw new Error("winner address does not match any player in game")
  }

  // guard: don't finish if already completed
  if (game.status === "completed") {
    throw new Error("game already completed")
  }

  const endTime = Date.now()
  const updates: Record<string, unknown> = {
    [`games/${gameId}/endTime`]: endTime,
    // use consistent winnerId field
    [`games/${gameId}/winnerId`]: winner,
    [`games/${gameId}/status`]: "completed",
  }
  if (typeof player1Score === "number") updates[`games/${gameId}/player1Score`] = player1Score
  if (typeof player2Score === "number") updates[`games/${gameId}/player2Score`] = player2Score

  // multi-path update at root
  await updateData("/", updates)

  // push to per-player match history and update stats
  const matchId = `m_${gameId}`

  // build an updated game snapshot to pass to match history
  const updatedGame = {
    ...game,
    player1: p1,
    player2: p2,
    endTime,
    winnerId: winner,
    player1Score: typeof player1Score === "number" ? player1Score : game.player1Score,
    player2Score: typeof player2Score === "number" ? player2Score : game.player2Score,
  }

  await addMatchForPlayers(gameId, matchId, p1, p2, winner, updatedGame as any)

  // update player stats (simple increment). reward handling can be added later.
  await updatePlayerStats(p1, winner === p1)
  await updatePlayerStats(p2, winner === p2)

  return { gameId, matchId }
}
