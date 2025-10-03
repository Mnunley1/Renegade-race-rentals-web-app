import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginPromptModal } from "@/components/ui/login-prompt-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MapPin, Search, Trophy, User, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MatchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { requireAuth, showLoginPrompt, closeLoginPrompt } = useAuthGuard();

  const mockDrivers = [
    {
      id: "1",
      name: "Alex Rodriguez",
      location: "Los Angeles, CA",
      experience: "5+ years",
      specialties: ["GT3", "Open Wheel"],
      rating: 4.9,
      bio: "Experienced track driver with multiple championship wins. Looking for a competitive team.",
    },
    {
      id: "2",
      name: "Sarah Chen",
      location: "Austin, TX",
      experience: "3+ years",
      specialties: ["Time Attack", "Endurance"],
      rating: 4.8,
      bio: "Engineer by day, racer by weekend. Passionate about precision driving and car setup.",
    },
    {
      id: "3",
      name: "Michael Thompson",
      location: "Phoenix, AZ",
      experience: "7+ years",
      specialties: ["Drift", "Circuit Racing"],
      rating: 4.9,
      bio: "Professional instructor and competitive driver seeking new racing opportunities.",
    },
  ];

  const mockTeams = [
    {
      id: "1",
      name: "Apex Racing Collective",
      location: "California",
      experience: "Professional",
      specialties: ["GT3", "Time Attack"],
      availableSeats: 2,
      requirements: "SCCA license required",
      description: "Competitive racing team focused on GT3 championships.",
    },
    {
      id: "2",
      name: "Weekend Warriors Racing",
      location: "Texas",
      experience: "Intermediate",
      specialties: ["Track Days", "HPDE"],
      availableSeats: 4,
      requirements: "Clean driving record",
      description: "Fun-focused group for weekend track enthusiasts.",
    },
    {
      id: "3",
      name: "Precision Motorsports",
      location: "Arizona",
      experience: "Advanced",
      specialties: ["Endurance", "Circuit"],
      availableSeats: 1,
      requirements: "Racing license preferred",
      description: "Semi-professional team competing in endurance events.",
    },
  ];

  return (
    <div className="container px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find Your Racing Match
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with racing teams and drivers to build your perfect racing
            community
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button>
            <Link to="/match/create-team" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Create Team
            </Link>
          </Button>
          <Button variant="outline">
            <Link to="/match/create-driver" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Create Driver Profile
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="teams" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Racing Teams</span>
            </TabsTrigger>
            <TabsTrigger
              value="drivers"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Drivers</span>
            </TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTeams.map((team) => (
                <Card
                  key={team.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 mb-2">
                          {team.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {team.location}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {team.availableSeats} seats
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700 text-sm">
                        {team.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Experience Level:
                          </span>
                          <Badge variant="secondary">{team.experience}</Badge>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Specialties:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {team.specialties.map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Requirements: </span>
                          <span className="text-gray-800">
                            {team.requirements}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() =>
                          requireAuth(() => {
                            console.log("Apply to join team:", team.id);
                          })
                        }
                      >
                        Apply to Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDrivers.map((driver) => (
                <Card
                  key={driver.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 mb-2">
                          {driver.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {driver.location}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {driver.rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700 text-sm">{driver.bio}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Experience:</span>
                          <Badge variant="secondary">{driver.experience}</Badge>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Specialties:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {driver.specialties.map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() =>
                          requireAuth(() => {
                            console.log("Contact driver:", driver.id);
                          })
                        }
                      >
                        Contact Driver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        title="Sign In to Connect"
        message="Please sign in to apply to teams and contact drivers."
      />
    </div>
  );
}
