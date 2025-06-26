import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Trophy, Users, CheckCircle, Target, Flame } from "lucide-react"

export default function DailyChallengePage() {
  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-500 mb-4">Today's Challenge</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Complete your daily problem to maintain your streak and progress in your tier.
          </p>
        </div>

        {/* User Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#1a1025] border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white/70">Current Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-500">Medium</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1025] border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white/70">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="text-2xl font-bold text-white">23 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1025] border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white/70">Problems Solved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-white">156</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Problem */}
        <Card className="bg-[#1a1025] border-yellow-500/30 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                  Medium
                </Badge>
                <CardTitle className="text-white">3Sum</CardTitle>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Est. 45 min</span>
              </div>
            </div>
            <CardDescription>Array • Two Pointers • Sorting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-3">Problem Description</h3>
              <p className="text-white/70 mb-4">
                Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i !=
                k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
              </p>
              <p className="text-white/70">Notice that the solution set must not contain duplicate triplets.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Example:</h4>
              <div className="bg-[#13111c] p-4 rounded-lg font-mono text-sm">
                <div className="text-white/60">Input:</div>
                <div className="text-white">nums = [-1,0,1,2,-1,-4]</div>
                <div className="text-white/60 mt-2">Output:</div>
                <div className="text-white">[[-1,-1,2],[-1,0,1]]</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="bg-yellow-600 hover:bg-yellow-700">Start Solving</Button>
              <Button variant="outline" className="border-purple-500/50 text-purple-400">
                View Hints
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Discussion and Solutions */}
        <Tabs defaultValue="discussion" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1a1025]">
            <TabsTrigger value="discussion" className="data-[state=active]:bg-purple-600">
              Discussion
            </TabsTrigger>
            <TabsTrigger value="approaches" className="data-[state=active]:bg-purple-600">
              Approaches
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussion" className="space-y-4">
            <Card className="bg-[#1a1025] border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-[#13111c] rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      <span className="text-white font-medium">Alex_Dev</span>
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                        Medium Tier
                      </Badge>
                    </div>
                    <p className="text-white/70">
                      The key insight is to sort the array first, then use two pointers to find the remaining two
                      numbers. This avoids the O(n³) brute force approach.
                    </p>
                  </div>

                  <div className="p-4 bg-[#13111c] rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                        S
                      </div>
                      <span className="text-white font-medium">Sarah_Code</span>
                      <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                        Hard Tier
                      </Badge>
                    </div>
                    <p className="text-white/70">
                      Don't forget to handle duplicates! You need to skip over duplicate values to avoid duplicate
                      triplets in your result.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approaches" className="space-y-4">
            <Card className="bg-[#1a1025] border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Solution Approaches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Approach 1: Two Pointers</h4>
                  <p className="text-white/70 mb-3">
                    Sort the array and use two pointers to find pairs that sum to the negative of the current element.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-400">Time: O(n²)</span>
                    <span className="text-blue-400">Space: O(1)</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Approach 2: Hash Set</h4>
                  <p className="text-white/70 mb-3">
                    Use a hash set to store seen values and find triplets without sorting.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-400">Time: O(n²)</span>
                    <span className="text-blue-400">Space: O(n)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="bg-[#1a1025] border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Today's Fastest Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "CodeMaster", time: "12:34", tier: "Hard" },
                    { rank: 2, name: "AlgoQueen", time: "15:22", tier: "Hard" },
                    { rank: 3, name: "DevNinja", time: "18:45", tier: "Medium" },
                    { rank: 4, name: "ByteWizard", time: "21:12", tier: "Medium" },
                    { rank: 5, name: "LogicLord", time: "23:56", tier: "Hard" },
                  ].map((entry) => (
                    <div key={entry.rank} className="flex items-center justify-between p-3 bg-[#13111c] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                          {entry.rank}
                        </div>
                        <span className="text-white font-medium">{entry.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            entry.tier === "Hard"
                              ? "border-red-500/50 text-red-400"
                              : entry.tier === "Medium"
                                ? "border-yellow-500/50 text-yellow-400"
                                : "border-green-500/50 text-green-400"
                          }`}
                        >
                          {entry.tier}
                        </Badge>
                      </div>
                      <span className="text-white/70 font-mono">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
