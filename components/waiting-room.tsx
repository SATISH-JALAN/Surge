"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { GameType } from "@/lib/game-types"
import { formatAddress } from "@/lib/game-utils"

interface WaitingRoomProps {
  gameType: GameType
  stake: string
  matchId: string
  account: string
  onGameStart: (opponent: string) => void
}

export default function WaitingRoom({ gameType, stake, matchId, account, onGameStart }: WaitingRoomProps) {
  const [opponent, setOpponent] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)
  const gameStartedRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockOpponent =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")
      setOpponent(mockOpponent)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!opponent) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [opponent])

  useEffect(() => {
    if (countdown <= 0 && opponent && !gameStartedRef.current) {
      gameStartedRef.current = true
      onGameStart(opponent)
    }
  }, [countdown, opponent, onGameStart])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl p-8 border-border">
        <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Match Found!</h2>

        {/* Players */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Player 1 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <p className="font-mono text-sm text-primary mb-2">{formatAddress(account)}</p>
            <p className="text-xs text-muted-foreground">You</p>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground mb-2">VS</p>
              <p className="text-xs text-muted-foreground">Stake: {stake} cUSD</p>
            </div>
          </div>

          {/* Player 2 */}
          <div className="text-center col-span-2 md:col-span-1">
            {opponent ? (
              <>
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="font-mono text-sm text-secondary mb-2">{formatAddress(opponent)}</p>
                <p className="text-xs text-muted-foreground">Opponent</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="text-sm text-muted-foreground">Waiting for opponent...</p>
              </>
            )}
          </div>
        </div>

        {/* Countdown */}
        {opponent && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Game starts in:</p>
            <p className="text-5xl font-bold text-primary">{countdown}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
