import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, PlusCircle, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for recipes
const mockRecipes = [
  {
    id: "1",
    name: "Spicy Chicken Pasta",
    user: "ChefAnna",
    likes: 120,
    comments: 15,
    imageUrl: "/placeholder.svg?width=300&height=200&text=Pasta",
    shortSupply: true,
  },
  {
    id: "2",
    name: "Vegan Lentil Soup",
    user: "GreenEats",
    likes: 250,
    comments: 30,
    imageUrl: "/placeholder.svg?width=300&height=200&text=Soup",
    shortSupply: false,
  },
  {
    id: "3",
    name: "Quick Beef Stir-fry",
    user: "FastMeals",
    likes: 85,
    comments: 10,
    imageUrl: "/placeholder.svg?width=300&height=200&text=Stir-fry",
    shortSupply: false,
  },
  {
    id: "4",
    name: "Berry Smoothie Bowl",
    user: "HealthyLife",
    likes: 300,
    comments: 45,
    imageUrl: "/placeholder.svg?width=300&height=200&text=Smoothie",
    shortSupply: true,
  },
  {
    id: "5",
    name: "Homemade Pizza",
    user: "PizzaMaster",
    likes: 180,
    comments: 22,
    imageUrl: "/placeholder.svg?width=300&height=200&text=Pizza",
    shortSupply: false,
  },
  {
    id: "6",
    name: "Chocolate Chip Cookies",
    user: "SweetTooth",
    likes: 450,
    comments: 60,
    imageUrl: "/placeholder.svg?width=300&height=200&text=Cookies",
    shortSupply: false,
  },
]

export default function RecipesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Discover Recipes</h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input type="search" placeholder="Search recipes..." className="max-w-sm" />
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Categories or Filters could go here */}
      {/* <div className="mb-8 flex space-x-2"> ...filter buttons... </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: (typeof mockRecipes)[0] }) {
  return (
    <Card className="overflow-hidden bg-white dark:bg-neutral-800 shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="relative">
          <Image
            src={recipe.imageUrl || "/placeholder.svg"}
            alt={recipe.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {recipe.shortSupply && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Hot Deal!</div>
          )}
        </div>
      </Link>
      <CardHeader className="pb-2">
        <Link href={`/recipes/${recipe.id}`}>
          <CardTitle className="text-lg hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
            {recipe.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground">By {recipe.user}</p>
      </CardHeader>
      <CardContent className="pb-4">{/* Could add a short description or tags here */}</CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="px-2">
            <Heart className="h-4 w-4 mr-1" /> {recipe.likes}
          </Button>
          <Button variant="ghost" size="sm" className="px-2">
            <MessageCircle className="h-4 w-4 mr-1" /> {recipe.comments}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-400"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardFooter>
    </Card>
  )
}
