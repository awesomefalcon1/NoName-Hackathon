import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Code, Target, ArrowRight, Clock, CheckCircle, Users, Briefcase } from "lucide-react"

export default function LevelsPage() {
  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-500 mb-4">Tier System</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Progress through three distinct tiers, each with unique challenges and exclusive benefits.
          </p>
        </div>

        {/* Level Progression Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Advancement Path</h2>
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Code className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-green-500 font-semibold">Easy Tier</h3>
              <p className="text-white/60 text-sm">1 Easy/day</p>
            </div>
            <ArrowRight className="h-8 w-8 text-purple-500 rotate-90 lg:rotate-0" />
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Target className="h-10 w-10 text-yellow-500" />
              </div>
              <h3 className="text-yellow-500 font-semibold">Medium Tier</h3>
              <p className="text-white/60 text-sm">1 Medium/day</p>
            </div>
            <ArrowRight className="h-8 w-8 text-purple-500 rotate-90 lg:rotate-0" />
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trophy className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-red-500 font-semibold">Hard Tier</h3>
              <p className="text-white/60 text-sm">1 Hard/day</p>
            </div>
          </div>
        </div>

        {/* Detailed Level Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Easy Tier */}
          <Card className="bg-[#1a1025] border-green-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-6 w-6 text-green-500" />
                  <CardTitle className="text-green-500">Easy Tier</CardTitle>
                </div>
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Beginner
                </Badge>
              </div>
              <CardDescription>Perfect starting point for coding journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Daily Commitment
                </h4>
                <p className="text-white/70">1 Easy problem per day</p>
                <p className="text-sm text-white/50">~15-30 minutes daily</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Perks & Benefits
                </h4>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Platform membership access
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Basic problem library
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Community discussions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Progress tracking
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Example Problems</h4>
                <div className="space-y-1 text-sm text-white/60">
                  <p>• Two Sum</p>
                  <p>• Valid Parentheses</p>
                  <p>• Merge Two Sorted Lists</p>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Start Easy Tier</Button>
            </CardContent>
          </Card>

          {/* Medium Tier */}
          <Card className="bg-[#1a1025] border-yellow-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-yellow-500" />
                  <CardTitle className="text-yellow-500">Medium Tier</CardTitle>
                </div>
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                  Intermediate
                </Badge>
              </div>
              <CardDescription>For developers ready to level up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Daily Commitment
                </h4>
                <p className="text-white/70">1 Medium problem per day</p>
                <p className="text-sm text-white/50">~30-60 minutes daily</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Career Benefits
                </h4>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Exclusive job board access
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Coffee chats with professionals
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Resume review sessions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Interview preparation
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Advancement Requirement</h4>
                <p className="text-sm text-white/60">Complete contest: 2 Easy + 2 Medium problems</p>
                <p className="text-xs text-white/50">Must solve ALL problems to advance</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Example Problems</h4>
                <div className="space-y-1 text-sm text-white/60">
                  <p>• Add Two Numbers</p>
                  <p>• Longest Substring</p>
                  <p>• Container With Most Water</p>
                </div>
              </div>

              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Advance to Medium</Button>
            </CardContent>
          </Card>

          {/* Hard Tier */}
          <Card className="bg-[#1a1025] border-red-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-red-500" />
                  <CardTitle className="text-red-500">Hard Tier</CardTitle>
                </div>
                <Badge variant="outline" className="border-red-500/50 text-red-400">
                  Elite
                </Badge>
              </div>
              <CardDescription>For elite competitive programmers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Daily Commitment
                </h4>
                <p className="text-white/70">1 Hard problem per day</p>
                <p className="text-sm text-white/50">~60-120 minutes daily</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Exclusive Access
                </h4>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Exclusive job opportunities
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Direct company connections
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Platform referrals
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Priority hiring consideration
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Advancement Requirement</h4>
                <p className="text-sm text-white/60">Complete contest: 2 Medium + 2 Hard problems</p>
                <p className="text-xs text-white/50">Must solve ALL problems to advance</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Example Problems</h4>
                <div className="space-y-1 text-sm text-white/60">
                  <p>• Median of Two Sorted Arrays</p>
                  <p>• Regular Expression Matching</p>
                  <p>• Merge k Sorted Lists</p>
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">Reach Hard Tier</Button>
            </CardContent>
          </Card>
        </div>

        {/* Contest & Progression Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-[#1a1025] border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-500">Contest Rules</CardTitle>
              <CardDescription>How to advance between tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Weekly Contests</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Must finish in top 10 to be eligible for advancement</li>
                  <li>• Dynamic difficulty ensures fair distribution</li>
                  <li>• Contests held every Sunday at 8 PM UTC</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Advancement Requirements</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-green-400 font-medium">Easy → Medium</p>
                    <p className="text-white/70 text-sm">Solve 2 Easy + 2 Medium problems</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <p className="text-yellow-400 font-medium">Medium → Hard</p>
                    <p className="text-white/70 text-sm">Solve 2 Medium + 2 Hard problems</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1025] border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-500">Strike System</CardTitle>
              <CardDescription>Accountability and demotion rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Daily Check-ins</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Missing a day results in a strike</li>
                  <li>• Make up missed days to clear strikes</li>
                  <li>• 3 strikes in a week = warning status</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Inactivity Demotion</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• 7+ days inactive = moved to inactive status</li>
                  <li>• Take placement test to return</li>
                  <li>• Test determines your new tier placement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">AI Usage Policy</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Gen AI allowed for algorithm research only</li>
                  <li>• Community verification prevents cheating</li>
                  <li>• AI-solved problems don't count for streaks</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
