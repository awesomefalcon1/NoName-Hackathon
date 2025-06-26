"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ChefHat, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  Plus
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  price: string
  category: string
  organizer: {
    name: string
    avatar: string
    verified: boolean
  }
  image: string
  tags: string[]
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { id: "all", name: "All Events", count: 24 },
    { id: "workshops", name: "Cooking Workshops", count: 8 },
    { id: "tastings", name: "Food Tastings", count: 6 },
    { id: "competitions", name: "Cook-offs", count: 4 },
    { id: "social", name: "Social Dining", count: 6 }
  ]

  const events: Event[] = [
    {
      id: "1",
      title: "Italian Pasta Making Workshop",
      description: "Learn to make authentic pasta from scratch with traditional techniques passed down through generations.",
      date: "Dec 28, 2024",
      time: "2:00 PM",
      location: "Chef Maria's Kitchen, Downtown",
      attendees: 12,
      maxAttendees: 16,
      price: "$45",
      category: "workshops",
      organizer: {
        name: "Chef Maria Romano",
        avatar: "/placeholder.svg",
        verified: true
      },
      image: "/placeholder.svg",
      tags: ["Italian", "Hands-on", "Beginner-friendly"]
    },
    {
      id: "2", 
      title: "Wine & Cheese Pairing Evening",
      description: "Discover the perfect combinations of artisanal cheeses and carefully selected wines.",
      date: "Dec 30, 2024",
      time: "7:00 PM", 
      location: "The Tasting Room, Midtown",
      attendees: 18,
      maxAttendees: 25,
      price: "$65",
      category: "tastings",
      organizer: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg",
        verified: true
      },
      image: "/placeholder.svg",
      tags: ["Wine", "Cheese", "Pairing"]
    },
    {
      id: "3",
      title: "New Year's Potluck Dinner",
      description: "Ring in 2025 with fellow food lovers! Bring your favorite dish and share stories over dinner.",
      date: "Jan 1, 2025",
      time: "6:00 PM",
      location: "Community Center, Westside", 
      attendees: 32,
      maxAttendees: 50,
      price: "Free",
      category: "social",
      organizer: {
        name: "Food Lovers Society",
        avatar: "/placeholder.svg",
        verified: true
      },
      image: "/placeholder.svg",
      tags: ["Potluck", "Social", "New Year"]
    },
    {
      id: "4",
      title: "BBQ Smoke-off Competition",
      description: "Show off your BBQ skills in this friendly competition. Prizes for best ribs, brisket, and sauce!",
      date: "Jan 5, 2025", 
      time: "12:00 PM",
      location: "Riverside Park",
      attendees: 8,
      maxAttendees: 20,
      price: "$25",
      category: "competitions",
      organizer: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg",
        verified: false
      },
      image: "/placeholder.svg",
      tags: ["BBQ", "Competition", "Outdoor"]
    },
    {
      id: "5",
      title: "Sushi Rolling Masterclass",
      description: "Master the art of sushi making with a professional sushi chef. All ingredients and tools provided.",
      date: "Jan 8, 2025",
      time: "11:00 AM", 
      location: "Sakura Sushi Academy",
      attendees: 6,
      maxAttendees: 12,
      price: "$75",
      category: "workshops",
      organizer: {
        name: "Chef Takeshi Yamamoto",
        avatar: "/placeholder.svg",
        verified: true
      },
      image: "/placeholder.svg",
      tags: ["Sushi", "Japanese", "Advanced"]
    },
    {
      id: "6",
      title: "Chocolate Tasting & Truffle Making",
      description: "Indulge in premium chocolates and learn to craft your own artisanal truffles.",
      date: "Jan 12, 2025",
      time: "3:00 PM",
      location: "Sweet Dreams Chocolatier",
      attendees: 14,
      maxAttendees: 18,
      price: "$55", 
      category: "tastings",
      organizer: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg",
        verified: true
      },
      image: "/placeholder.svg",
      tags: ["Chocolate", "Dessert", "Sweet"]
    }
  ]

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">Culinary Community</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Connect with fellow food enthusiasts, join cooking events, and discover amazing culinary experiences in your area.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
              <Input
                placeholder="Search events, cuisines, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "border-white/20 text-white/70 hover:bg-white/10"
                }`}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white/80">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Event */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Event</h2>
          <Card className="bg-gradient-to-r from-orange-900/50 to-red-600/50 border-orange-500/50 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3">
                <img
                  src="/placeholder.svg"
                  alt="Featured event"
                  className="w-full h-48 lg:h-full object-cover"
                />
              </div>
              <div className="lg:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="bg-orange-600 text-white mb-2">Featured</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">Holiday Cookie Decorating Workshop</h3>
                    <p className="text-white/80 mb-4">
                      Get into the holiday spirit with our festive cookie decorating workshop. Learn professional 
                      techniques and take home beautiful cookies to share with family and friends.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-white/80">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Dec 23, 2024</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">2:00 PM</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">Sweet Studio</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">8/12 attending</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium text-sm">Sweet Creations Studio</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-white/60 text-xs ml-1">4.9 • Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">$35</span>
                    <Button className="bg-white text-orange-900 hover:bg-white/90">
                      Join Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            <div className="flex items-center space-x-2 text-white/60">
              <Filter className="h-4 w-4" />
              <span className="text-sm">{filteredEvents.length} events found</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-[#1a1025] border-orange-500/20 overflow-hidden hover:border-orange-500/40 transition-colors">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-600 text-white">{event.price}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 p-2">
                      <Heart className="h-3 w-3 text-white" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 p-2">
                      <Share2 className="h-3 w-3 text-white" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-white/60 text-sm">
                      <Calendar className="h-3 w-3 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-white/60 text-sm">
                      <MapPin className="h-3 w-3 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-white/60 text-sm">
                      <Users className="h-3 w-3 mr-2" />
                      {event.attendees}/{event.maxAttendees} attending
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-orange-500/50 text-orange-400 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <span className="text-white/80 text-xs">{event.organizer.name}</span>
                        {event.organizer.verified && (
                          <Star className="h-3 w-3 text-yellow-400 fill-current ml-1" />
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#1a1025] border-orange-500/30 text-center">
            <CardContent className="p-6">
              <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2,847</div>
              <div className="text-white/60 text-sm">Active Cooks</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1025] border-orange-500/30 text-center">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">124</div>
              <div className="text-white/60 text-sm">Events This Month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1025] border-orange-500/30 text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15,693</div>
              <div className="text-white/60 text-sm">Community Members</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1025] border-orange-500/30 text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-white/60 text-sm">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-[#1a1025] border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-orange-500 text-center">How Our Community Works</CardTitle>
            <CardDescription className="text-center">
              Join, learn, and share your culinary passion with like-minded food enthusiasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Discover Events</h3>
                <p className="text-white/70 text-sm">
                  Browse cooking workshops, food tastings, and culinary experiences in your area.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Connect & Learn</h3>
                <p className="text-white/70 text-sm">
                  Meet fellow food lovers, learn new techniques, and share your culinary knowledge.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Host Your Own</h3>
                <p className="text-white/70 text-sm">
                  Share your expertise by hosting cooking classes, dinners, or food experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
