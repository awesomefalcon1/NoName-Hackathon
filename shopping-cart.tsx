"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
  image: string
  recipeId: string
  recipeName: string
  category: string
}

interface GroupedCartItems {
  [recipeId: string]: {
    recipeName: string
    items: CartItem[]
    totalPrice: number
  }
}

// Mock cart data grouped by recipes
const mockCartItems: CartItem[] = [
  // Spicy Chicken Pasta Recipe
  {
    id: "1",
    name: "Chicken Breast",
    price: 8.99,
    quantity: 1,
    unit: "lb",
    image: "/placeholder.svg?height=80&width=80&text=Chicken",
    recipeId: "recipe-1",
    recipeName: "Spicy Chicken Pasta",
    category: "Meat",
  },
  {
    id: "2",
    name: "Penne Pasta",
    price: 2.49,
    quantity: 1,
    unit: "box",
    image: "/placeholder.svg?height=80&width=80&text=Pasta",
    recipeId: "recipe-1",
    recipeName: "Spicy Chicken Pasta",
    category: "Pantry",
  },
  {
    id: "3",
    name: "Heavy Cream",
    price: 3.29,
    quantity: 1,
    unit: "cup",
    image: "/placeholder.svg?height=80&width=80&text=Cream",
    recipeId: "recipe-1",
    recipeName: "Spicy Chicken Pasta",
    category: "Dairy",
  },
  {
    id: "4",
    name: "Red Pepper Flakes",
    price: 1.99,
    quantity: 1,
    unit: "jar",
    image: "/placeholder.svg?height=80&width=80&text=Spices",
    recipeId: "recipe-1",
    recipeName: "Spicy Chicken Pasta",
    category: "Spices",
  },
  // Vegan Lentil Soup Recipe
  {
    id: "5",
    name: "Red Lentils",
    price: 3.99,
    quantity: 2,
    unit: "cups",
    image: "/placeholder.svg?height=80&width=80&text=Lentils",
    recipeId: "recipe-2",
    recipeName: "Vegan Lentil Soup",
    category: "Pantry",
  },
  {
    id: "6",
    name: "Vegetable Broth",
    price: 2.79,
    quantity: 1,
    unit: "carton",
    image: "/placeholder.svg?height=80&width=80&text=Broth",
    recipeId: "recipe-2",
    recipeName: "Vegan Lentil Soup",
    category: "Pantry",
  },
  {
    id: "7",
    name: "Carrots",
    price: 1.89,
    quantity: 3,
    unit: "pieces",
    image: "/placeholder.svg?height=80&width=80&text=Carrots",
    recipeId: "recipe-2",
    recipeName: "Vegan Lentil Soup",
    category: "Produce",
  },
  {
    id: "8",
    name: "Celery",
    price: 2.49,
    quantity: 1,
    unit: "bunch",
    image: "/placeholder.svg?height=80&width=80&text=Celery",
    recipeId: "recipe-2",
    recipeName: "Vegan Lentil Soup",
    category: "Produce",
  },
  // Berry Smoothie Bowl Recipe
  {
    id: "9",
    name: "Mixed Berries",
    price: 4.99,
    quantity: 1,
    unit: "bag",
    image: "/placeholder.svg?height=80&width=80&text=Berries",
    recipeId: "recipe-3",
    recipeName: "Berry Smoothie Bowl",
    category: "Produce",
  },
  {
    id: "10",
    name: "Greek Yogurt",
    price: 5.49,
    quantity: 1,
    unit: "container",
    image: "/placeholder.svg?height=80&width=80&text=Yogurt",
    recipeId: "recipe-3",
    recipeName: "Berry Smoothie Bowl",
    category: "Dairy",
  },
  {
    id: "11",
    name: "Granola",
    price: 6.99,
    quantity: 1,
    unit: "bag",
    image: "/placeholder.svg?height=80&width=80&text=Granola",
    recipeId: "recipe-3",
    recipeName: "Berry Smoothie Bowl",
    category: "Pantry",
  },
]

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)

  // Group items by recipe
  const groupedItems: GroupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = {
        recipeName: item.recipeName,
        items: [],
        totalPrice: 0,
      }
    }
    acc[item.recipeId].items.push(item)
    acc[item.recipeId].totalPrice += item.price * item.quantity
    return acc
  }, {} as GroupedCartItems)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some delicious recipes to get started!</p>
          <Link href="/recipes">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Browse Recipes</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Shopping Cart</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {getTotalItems()} items
            </Badge>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedItems).map(([recipeId, recipeGroup]) => (
              <Card key={recipeId} className="overflow-hidden">
                {/* Recipe Header */}
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{recipeGroup.recipeName}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {recipeGroup.items.length} ingredients
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">${recipeGroup.totalPrice.toFixed(2)}</span>
                    </div>
                  </CardTitle>
                </CardHeader>

                {/* Recipe Items */}
                <CardContent className="p-0">
                  {recipeGroup.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="p-4 flex items-center space-x-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-neutral-800 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-lg font-bold text-amber-600">
                            ${item.price.toFixed(2)} per {item.unit}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {index < recipeGroup.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>PCO Points Discount</span>
                  <span>-$2.50</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(getTotalPrice() + 4.99 - 2.5).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">You'll earn</p>
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    +{Math.floor(getTotalPrice() * 10)} PCO Points
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <Link href="/recipes" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  ← Continue Shopping
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
