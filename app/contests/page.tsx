import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Clock, Users, Target, ArrowRight } from "lucide-react"

export default function ContestsPage() {
  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-500 mb-4">Programming Contests</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Compete in weekly contests to advance between tiers and showcase your programming skills.
          </p>
        </div>

        {/* Next Contest */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-purple-600/50 border-purple-500/50 mb-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Trophy className="h-6 w-6 mr-2" />
                  Weekly Contest #47
                </CardTitle>
                <CardDescription className="text-white/80">
                  Next contest starts in 2 days, 14 hours, 23 minutes
                </CardDescription>
              </div>
              <Badge className="bg-purple-600 text-white">Registration Open</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Sunday, Dec 15</p>
                  <p className="text-white/60 text-sm">8:00 PM UTC</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Duration</p>
                  <p className="text-white/60 text-sm">2 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Participants</p>
                  <p className="text-white/60 text-sm">1,247 registered</p>
                </div>
              </div>
            </div>
            <Button className="bg-white text-purple-900 hover:bg-white/90">Register for Contest</Button>
          </CardContent>
        </Card>

        {/* Contest Format */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-[#1a1025] border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-500">Contest Format</CardTitle>
              <CardDescription>How contests work and scoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Structure</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• 4 problems of varying difficulty</li>
                  <li>• 2 hours to solve as many as possible</li>
                  <li>• Dynamic difficulty based on tier distribution</li>
                  <li>• Real-time leaderboard updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Scoring</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Points based on difficulty and solve time</li>
                  <li>• Penalty for wrong submissions</li>
                  <li>• Bonus points for first solvers</li>
                  <li>• Top 10 finishers eligible for advancement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1025] border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-500">Advancement Rules</CardTitle>
              <CardDescription>Requirements to move between tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-medium">Easy → Medium</span>
                    <ArrowRight className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-white/70 text-sm">Solve 2 Easy + 2 Medium problems</p>
                  <p className="text-white/50 text-xs">Must complete ALL 4 problems</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-medium">Medium → Hard</span>
                    <ArrowRight className="h-4 w-4 text-yellow-400" />
                  </div>
                  <p className="text-white/70 text-sm">Solve 2 Medium + 2 Hard problems</p>
                  <p className="text-white/50 text-xs">Must complete ALL 4 problems</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                <p className="text-purple-400 font-medium mb-1">Additional Requirements</p>
                <p className="text-white/70 text-sm">Finish in top 10 overall ranking</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contests */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Recent Contests</h2>
          <div className="space-y-4">
            {[
              {
                id: 46,
                date: "Dec 8, 2024",
                participants: 1156,
                winner: "CodeMaster_Pro",
                problems: ["Two Sum Variants", "Binary Tree Paths", "Graph Traversal", "Dynamic Programming"],
              },
              {
                id: 45,
                date: "Dec 1, 2024",
                participants: 1089,
                winner: "AlgoQueen",
                problems: ["Array Manipulation", "String Processing", "Tree Algorithms", "Advanced DP"],
              },
              {
                id: 44,
                date: "Nov 24, 2024",
                participants: 1234,
                winner: "ByteWizard",
                problems: ["Hash Tables", "Sliding Window", "Graph Theory", "Optimization"],
              },
            ].map((contest) => (
              <Card key={contest.id} className="bg-[#1a1025] border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold">Weekly Contest #{contest.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <span>{contest.date}</span>
                        <span>{contest.participants} participants</span>
                        <span>Winner: {contest.winner}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {contest.problems.map((problem, index) => (
                          <Badge key={index} variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                            {problem}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="border-purple-500/50 text-purple-400">
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contest Tips */}
        <Card className="bg-[#1a1025] border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-500 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Contest Tips & Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Before the Contest</h4>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• Review common algorithms and data structures</li>
                  <li>• Practice similar problems on LeetCode/HackerRank</li>
                  <li>• Set up your coding environment</li>
                  <li>• Get familiar with the contest platform</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">During the Contest</h4>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• Read all problems first to plan your approach</li>
                  <li>• Start with problems you're most confident about</li>
                  <li>• Test your solutions thoroughly before submitting</li>
                  <li>• Manage your time effectively across problems</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
