import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1025] border-purple-900/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center text-white/60">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-[#13111c] border-purple-900/20"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-purple-500 hover:text-purple-400">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" className="bg-[#13111c] border-purple-900/20" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Sign In</Button>
          <div className="text-center text-sm text-white/60">
            Don't have an account?{" "}
            <Link href="/get-started" className="text-purple-500 hover:text-purple-400">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
