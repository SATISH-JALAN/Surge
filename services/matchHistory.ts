import { pushData, writeData } from "@/lib/firebase-db"
import { MatchHistoryRecord, GameRecord } from "@/lib/firebase-types"

function normalizeAddress(a: string) {
  return a.toLowerCase()
}

export async function addMatchForPlayers(gameId: string, matchId: string, p1: string, p2: string, winner: string, game: any) {
  const now = Date.now()
  const recordForP1: MatchHistoryRecord = {
    matchId,
    gameId,
    opponent: p2,
    outcome: winner === p1 ? "win" : "loss",
    score: game.player1Score,
    stake: game.stakes?.player1Stake || 0,
    timestamp: now,
    gameType: game.gameType,
  }
  const recordForP2: MatchHistoryRecord = {
    matchId,
    gameId,
    opponent: p1,
    outcome: winner === p2 ? "win" : "loss",
    score: game.player2Score,
    stake: game.stakes?.player2Stake || 0,
    timestamp: now,
    gameType: game.gameType,
  }

  // store under players' addresses to make lookup by player easy
  await pushData(`matchHistory/${normalizeAddress(p1)}`, recordForP1)
  await pushData(`matchHistory/${normalizeAddress(p2)}`, recordForP2)

  // also store canonical match record
  await pushData(`matchHistory/all`, { matchId, gameId, player1: p1, player2: p2, winner, timestamp: now, gameType: game.gameType })
}
