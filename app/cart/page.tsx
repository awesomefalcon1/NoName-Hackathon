"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { useState } from "react"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

function CartPageContent() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "NoName Pasta",
      price: 2.99,
      quantity: 2,
      imageUrl: "/placeholder.svg?width=60&height=60&text=Pasta"
    },
    {
      id: "2", 
      name: "NoName Tomato Sauce",
      price: 1.49,
      quantity: 1,
      imageUrl: "/placeholder.svg?width=60&height=60&text=Sauce"
    }
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-yellow-500" />
            Your Cart
          </CardTitle>
          <CardDescription>
            Review your NoName products before checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">Total: ${total.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function CartPage() {
  return (
    <ProtectedRoute message="Please sign in to view your cart.">
      <CartPageContent />
    </ProtectedRoute>
  )
}
