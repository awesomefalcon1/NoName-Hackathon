"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, PlusCircle, Compass, User, ShoppingCart, Utensils } from "lucide-react"
import { ModeToggle } from "./mode-toggle" // Assuming you have a theme toggle

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/recipes", label: "Recipes", icon: Compass },
    { href: "/upload", label: "Upload", icon: PlusCircle },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 shadow-sm">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Utensils className="h-7 w-7 text-yellow-500" />
          <span className="text-xl font-bold text-neutral-800 dark:text-white">
            NoName <span className="text-yellow-500">Recipes</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-1 transition-colors ${
                pathname === link.href
                  ? "text-yellow-500 font-semibold"
                  : "text-neutral-600 dark:text-neutral-300 hover:text-yellow-500 dark:hover:text-yellow-400"
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <ModeToggle />
          <Button className="hidden sm:inline-flex bg-yellow-500 hover:bg-yellow-600 text-black">Sign In</Button>
        </div>
      </div>
    </header>
  )
}
