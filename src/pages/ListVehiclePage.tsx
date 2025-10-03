import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Calendar,
  Car,
  Cog,
  DollarSign,
  Gauge,
  MapPin,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export default function ListVehiclePage() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch tracks for dropdown
  const tracks = useQuery(api.tracks.list);

  // Vehicle creation mutation
  const createVehicle = useMutation(api.vehicles.create);

  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    dailyRate: "",
    description: "",
    horsepower: "",
    transmission: "",
    drivetrain: "",
    mileage: "",
    fuelType: "",
    color: "",
    trackId: "",
    amenities: [] as string[],
  });

  const [images, setImages] = useState<string[]>([]);

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Owner Account Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in with an owner account to list your vehicle.
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      const vehicleData = {
        trackId: formData.trackId as any,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        dailyRate: parseFloat(formData.dailyRate),
        description: formData.description,
        horsepower: parseInt(formData.horsepower),
        transmission: formData.transmission,
        drivetrain: formData.drivetrain,
        mileage: parseInt(formData.mileage),
        fuelType: formData.fuelType,
        color: formData.color,
        amenities: formData.amenities,
        images: images.length > 0 ? images : [],
        userId: user.id,
      };

      await createVehicle(vehicleData);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      setErrors([
        error.message || "An error occurred while creating the vehicle.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenityOptions = [
    "Air Conditioning",
    "Heated Seats",
    "Navigation System",
    "Bluetooth Connectivity",
    "Premium Sound System",
    "Leather Seats",
    "Sport Suspension",
    "Track Mode",
    "Launch Control",
    "Carbon Fiber Parts",
    "Performance Tires",
    "Ceramic Wheels",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-[#EF1C25]" />
            <h1 className="text-3xl font-bold text-gray-900">
              List Your Vehicle
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Share your track car with the racing community and start earning.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="make"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Make *
                      </label>
                      <Input
                        id="make"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        placeholder="e.g., Porsche"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="model"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Model *
                      </label>
                      <Input
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="e.g., 911 GT3"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Year *
                      </label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        min="1990"
                        max="2024"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="2023"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your vehicle, its condition, and what makes it special..."
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#EF1C25] focus:border-transparent"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="dailyRate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Daily Rate *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="dailyRate"
                          name="dailyRate"
                          type="number"
                          min="1"
                          value={formData.dailyRate}
                          onChange={handleInputChange}
                          placeholder="899"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="trackId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Track Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                          id="trackId"
                          name="trackId"
                          value={formData.trackId}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF1C25] focus:border-transparent bg-white"
                          required
                        >
                          <option value="">Select a track</option>
                          {tracks?.map((track) => (
                            <option key={track._id} value={track._id}>
                              {track.name} - {track.location}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="horsepower"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Horsepower *
                      </label>
                      <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="horsepower"
                          name="horsepower"
                          type="number"
                          min="1"
                          value={formData.horsepower}
                          onChange={handleInputChange}
                          placeholder="502"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="transmission"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Transmission *
                      </label>
                      <div className="relative">
                        <Cog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                          id="transmission"
                          name="transmission"
                          value={formData.transmission}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF1C25] focus:border-transparent bg-white"
                          required
                        >
                          <option value="">Select transmission</option>
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                          <option value="PDK">PDK</option>
                          <option value="DCT">DCT</option>
                          <option value="CVT">CVT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="drivetrain"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Drivetrain *
                      </label>
                      <select
                        id="drivetrain"
                        name="drivetrain"
                        value={formData.drivetrain}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF1C25] focus:border-transparent bg-white"
                        required
                      >
                        <option value="">Select drivetrain</option>
                        <option value="RWD">Rear Wheel Drive</option>
                        <option value="FWD">Front Wheel Drive</option>
                        <option value="AWD">All Wheel Drive</option>
                        <option value="4WD">Four Wheel Drive</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="mileage"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mileage *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="mileage"
                          name="mileage"
                          type="number"
                          min="1"
                          value={formData.mileage}
                          onChange={handleInputChange}
                          placeholder="15000"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="fuelType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Fuel Type
                      </label>
                      <select
                        id="fuelType"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF1C25] focus:border-transparent bg-white"
                      >
                        <option value="">Select fuel type</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Flex Fuel">Flex Fuel</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="color"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Color
                      </label>
                      <Input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="e.g., Guards Red"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenityOptions.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          formData.amenities.includes(amenity)
                            ? "border-[#EF1C25] bg-[#EF1C25]/5 text-[#EF1C25]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-sm font-medium">{amenity}</span>
                        {formData.amenities.includes(amenity) && (
                          <div className="w-2 h-2 rounded-full bg-[#EF1C25]"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Vehicle Photos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add high-quality photos of your vehicle (up to 10 images)
                    </p>
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG files up to 5MB each
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Listing Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehicle</span>
                    <span className="font-semibold">
                      {formData.year && formData.make && formData.model
                        ? `${formData.year} ${formData.make} ${formData.model}`
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Daily Rate</span>
                    <span className="font-semibold text-[#EF1C25]">
                      ${formData.dailyRate || "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Horsepower</span>
                    <span className="font-semibold">
                      {formData.horsepower
                        ? `${formData.horsepower} HP`
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amenities</span>
                    <span className="font-semibold">
                      {formData.amenities.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Tips for Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-[#EF1C25] mt-2"></div>
                    <p className="text-sm text-gray-600">
                      Include high-quality photos showing different angles
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-[#EF1C25] mt-2"></div>
                    <p className="text-sm text-gray-600">
                      Write a detailed description of your vehicle's condition
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-[#EF1C25] mt-2"></div>
                    <p className="text-sm text-gray-600">
                      Set competitive pricing based on similar vehicles
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-[#EF1C25] mt-2"></div>
                    <p className="text-sm text-gray-600">
                      Be responsive to booking requests and messages
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Listing..." : "Create Listing"}
            </Button>
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <h4 className="font-medium text-red-900 mb-2">
                Please fix the following errors:
              </h4>
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
