import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1025] border-purple-900/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center text-white/60">Time to move in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" className="bg-[#13111c] border-purple-900/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" className="bg-[#13111c] border-purple-900/20" />
            </div>
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="bg-[#13111c] border-purple-900/20" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm text-white/60">
              I agree to the{" "}
              <Link href="/terms" className="text-purple-500 hover:text-purple-400">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-500 hover:text-purple-400">
                privacy policy
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Account</Button>
          <div className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-500 hover:text-purple-400">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
