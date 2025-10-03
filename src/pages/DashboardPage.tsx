import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Car, 
  Calendar, 
  MessageSquare, 
  Users, 
  Star,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  // Mock user data for now
  const user = { firstName: "Demo", fullName: "Demo User" };

  const stats = [
    {
      title: "Active Bookings",
      value: "2",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Total Rentals",
      value: "12",
      icon: Car,
      color: "text-green-600"
    },
    {
      title: "Messages",
      value: "3",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Rating",
      value: "5.0",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  const recentActivity = [
    {
      type: "booking_confirmed",
      title: "Booking Confirmed",
      description: "2023 Porsche 911 GT3 for March 15-17",
      time: "2 hours ago"
    },
    {
      type: "message_received",
      title: "New Message",
      description: "From car owner about pickup details",
      time: "1 day ago"
    },
    {
      type: "review_received",
      title: "Review Received",
      description: "5-star review from recent rental",
      time: "3 days ago"
    }
  ];

  if (!user) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your dashboard</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName || user.fullName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your rentals and track your activity
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline">
              <Link to="/explore" className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Browse Cars
              </Link>
            </Button>
            <Button>
              <Link to="/add-listing" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                List Your Car
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest rental activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No bookings yet</p>
                  <Button>
                    <Link to="/explore">Book Your First Car</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-[#FF5A5F] rounded-full mt-2"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/messages" className="flex flex-col items-center space-y-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Messages</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/match" className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Find Teams</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/profile" className="flex flex-col items-center space-y-2">
                  <Star className="h-6 w-6" />
                  <span>My Profile</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/add-listing" className="flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Listing</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}