export type GameType =
  | "Number Memory Battle"
  | "Word Scramble Duel"
  | "Pattern Predictor"
  | "Reflex War"
  | "Memory Match Showdown"

export interface MatchmakingEntry {
  playerAddress: string // lowercase 0x...
  gameType: GameType
  stake: number // currency, 2 decimals
  gameTypeStake: string // composite key e.g. "Number Memory Battle#0.50"
  timestamp: number // unix ms
  status: "waiting" | "matched"
}

export interface GameRecord {
  id?: string
  player1: string // address
  player2: string // address
  gameType: GameType
  startTime: number
  endTime?: number
  winner?: string
  stakes: { player1Stake: number; player2Stake: number }
  status: "active" | "completed"
  player1Score?: number
  player2Score?: number
}

export interface PlayerProfile {
  address: string
  username?: string
  wins: number
  losses: number
  totalEarnings: number // currency
  createdAt: number
  lastActive?: number
}

export interface MatchHistoryRecord {
  matchId: string
  gameId: string
  opponent: string
  outcome: "win" | "loss" | "draw"
  score?: number
  stake: number
  timestamp: number
  gameType: GameType
}

export interface NotificationItem {
  id?: string
  message: string
  timestamp: number
  isRead: boolean
}

export interface PlatformStats {
  dailyActiveUsers: number
  totalGamesPlayed: number
  totalRevenue: number
  timestamp: number
}
