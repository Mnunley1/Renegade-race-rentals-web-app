import { mutation } from "./_generated/server";

export const seedVehicles = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if vehicles already exist
    const existingVehicles = await ctx.db.query("vehicles").collect();
    if (existingVehicles.length > 0) {
      console.log("Vehicles already exist, skipping seed");
      return;
    }

    // Create test tracks first
    const track1 = await ctx.db.insert("tracks", {
      name: "Laguna Seca Raceway",
      location: "Salinas, CA",
      description: "Famous raceway featuring the famous Corkscrew turn",
      imageUrl:
        "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: true,
    });

    const track2 = await ctx.db.insert("tracks", {
      name: "Willow Springs International Raceway",
      location: "Rosamond, CA",
      description: "High-speed circuit perfect for testing vehicle performance",
      imageUrl:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: true,
    });

    const track3 = await ctx.db.insert("tracks", {
      name: "Sonoma Raceway",
      location: "Sonoma, CA",
      description: "Popular NASCAR track with multiple configurations",
      imageUrl:
        "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: true,
    });

    // Create test vehicles
    const vehicles = [
      {
        trackId: track1,
        make: "Porsche",
        model: "911 GT3",
        year: 2023,
        dailyRate: 899,
        description:
          "Track-focused precision machine with naturally aspirated flat-six engine delivering 502 horsepower. Perfect for track days with its razor-sharp handling and precision engineering.",
        horsepower: 502,
        transmission: "PDK",
        drivetrain: "RWD",
        mileage: 12500,
        fuelType: "Premium Gasoline",
        color: "Guards Red",
        amenities: [
          "Track-ready suspension",
          "Carbon ceramic brakes",
          "Roll cage",
          "Data logging",
          "Professional pit crew support",
        ],
        images: [
          "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200",
        ],
        addOns: [
          {
            name: "Track Insurance",
            description: "Comprehensive insurance coverage for track days",
            price: 150,
            isRequired: true,
          },
          {
            name: "Performance Tuning",
            description: "Professional ECU tuning for enhanced performance",
            price: 300,
            isRequired: false,
          },
        ],
        isActive: true,
        ownerId: "user_test_1",
      },
      {
        trackId: track2,
        make: "McLaren",
        model: "720S",
        year: 2022,
        dailyRate: 1299,
        description:
          "Supercar with active aerodynamics and twin-turbo V8 power delivering explosive acceleration. Features cutting-edge technology and breathtaking performance.",
        horsepower: 710,
        transmission: "Automatic",
        drivetrain: "RWD",
        mileage: 8900,
        fuelType: "Premium Gasoline",
        color: "Papaya Orange",
        amenities: [
          "Active aerodynamics",
          "Race mode",
          "Launch control",
          "Telemetry system",
          "Professional driver coaching",
        ],
        isActive: true,
        ownerId: "user_test_2",
      },
      {
        trackId: track3,
        make: "Ferrari",
        model: "488 GTB",
        year: 2024,
        dailyRate: 1599,
        description:
          "Italian masterpiece with turbocharged V8 and razor-sharp handling. Experience the pinnacle of automotive engineering with this track-ready Ferrari.",
        horsepower: 661,
        transmission: "DCT",
        drivetrain: "RWD",
        mileage: 5600,
        fuelType: "Premium Gasoline",
        color: "Rosso Corsa",
        amenities: [
          "Carbon fiber body panels",
          "F1-inspired gearbox",
          "Adjustable suspension",
          "Race harnesses",
          "Fire suppression system",
        ],
        images: [
          "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200",
        ],
        addOns: [
          {
            name: "Luxury Transport",
            description: "Door-to-track transportation service",
            price: 200,
            isRequired: false,
          },
        ],
        isActive: true,
        ownerId: "user_test_3",
      },
    ];

    for (const vehicle of vehicles) {
      await ctx.db.insert("vehicles", {
        ...vehicle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isApproved: true,
      });
    }

    console.log(`Created ${vehicles.length} test vehicles and 3 tracks`);
  },
});

export const seedTestUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if test users already exist
    const existingUsers = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", "user_test_1"))
      .first();

    if (existingUsers) {
      console.log("Test users already exist, skipping seed");
      return;
    }

    const testUsers = [
      {
        externalId: "user_test_1",
        name: "Alex Rodriguez",
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        rating: 4.9,
        totalRentals: 45,
        memberSince: "January 2022",
        profileImage: null,
        userType: "host" as const,
      },
      {
        externalId: "user_test_2",
        name: "Sarah Chen",
        email: "sarah@example.com",
        phone: "+1 (555) 234-5678",
        rating: 4.8,
        totalRentals: 32,
        memberSince: "March 2022",
        profileImage: null,
        userType: "host" as const,
      },
      {
        externalId: "user_test_3",
        name: "Michael Thompson",
        email: "michael@example.com",
        phone: "+1 (555) 345-6789",
        rating: 5.0,
        totalRentals: 28,
        memberSince: "June 2022",
        profileImage: null,
        userType: "host" as const,
      },
    ];

    for (const user of testUsers) {
      await ctx.db.insert("users", user);
    }

    console.log(`Created ${testUsers.length} test users`);
  },
});
