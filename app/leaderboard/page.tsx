"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Medal, TrendingUp } from "lucide-react"

const leaderboardData = [
  { rank: 1, player: "ProGamer_01", wins: 156, winRate: "89%", earnings: "$4,250.00", streak: 12 },
  { rank: 2, player: "SkillMaster", wins: 142, winRate: "86%", earnings: "$3,890.00", streak: 8 },
  { rank: 3, player: "QuickThink", wins: 138, winRate: "84%", earnings: "$3,650.00", streak: 6 },
  { rank: 4, player: "MindGames", wins: 125, winRate: "81%", earnings: "$3,200.00", streak: 5 },
  { rank: 5, player: "BrainPower", wins: 118, winRate: "79%", earnings: "$2,950.00", streak: 4 },
  { rank: 6, player: "FastReflexes", wins: 112, winRate: "77%", earnings: "$2,750.00", streak: 3 },
  { rank: 7, player: "MemoryKing", wins: 105, winRate: "75%", earnings: "$2,500.00", streak: 2 },
  { rank: 8, player: "WordWizard", wins: 98, winRate: "72%", earnings: "$2,200.00", streak: 1 },
  { rank: 9, player: "PatternPro", wins: 92, winRate: "70%", earnings: "$1,950.00", streak: 0 },
  { rank: 10, player: "ChampionX", wins: 87, winRate: "68%", earnings: "$1,750.00", streak: 0 },
]

const getMedalColor = (rank: number) => {
  if (rank === 1) return "text-yellow-500"
  if (rank === 2) return "text-gray-400"
  if (rank === 3) return "text-orange-600"
  return "text-muted-foreground"
}

export default function LeaderboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Top players ranked by wins and earnings</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all-time" className="w-full">
        <TabsList>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
              <CardDescription>Ranked by total wins and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8">
                        {entry.rank <= 3 ? (
                          <Medal className={`w-6 h-6 ${getMedalColor(entry.rank)}`} />
                        ) : (
                          <span className="font-bold text-muted-foreground">#{entry.rank}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{entry.player}</p>
                        <p className="text-sm text-muted-foreground">{entry.wins} wins</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{entry.winRate}</p>
                        <p className="text-xs text-muted-foreground">win rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent">{entry.earnings}</p>
                        <p className="text-xs text-muted-foreground">earnings</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-secondary" />
                          <p className="text-sm font-semibold text-secondary">{entry.streak}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">streak</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-8">Monthly leaderboard data coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-8">Weekly leaderboard data coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
