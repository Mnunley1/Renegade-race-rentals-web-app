import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { Camera, Edit, Save, User, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your profile.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/sign-up">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.emailAddresses[0]?.emailAddress || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#EF1C25] flex items-center justify-center text-white text-2xl font-bold">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {displayName}
              </h1>
              <p className="text-gray-600">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-[#EF1C25] text-white border-0">
                  {user.createdAt
                    ? `Member since ${new Date(user.createdAt).getFullYear()}`
                    : "Member"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-[#EF1C25] flex items-center justify-center text-white text-lg font-bold">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      First Name
                    </label>
                    {isEditing ? (
                      <Input
                        defaultValue={user.firstName || ""}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.firstName || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Last Name
                    </label>
                    {isEditing ? (
                      <Input
                        defaultValue={user.lastName || ""}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.lastName || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      defaultValue={user.emailAddresses[0]?.emailAddress || ""}
                      placeholder="Enter email address"
                      type="email"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input placeholder="Enter phone number" type="tel" />
                  ) : (
                    <p className="text-gray-900">Not provided</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900">No bio provided</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {user.createdAt
                      ? new Date(user.createdAt).getFullYear()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/settings">Account Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
