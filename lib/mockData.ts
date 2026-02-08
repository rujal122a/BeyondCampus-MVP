
export const CURRENT_USER = { id: 1, name: "You", budget: 15000 };

export interface LobbyMember {
    id: number;
    name: string;
    tags: string[];
    avatar: string;
    status: "Looking" | "Joined";
}

export interface Flat {
    id: number;
    title: string;
    location: string;
    price: number;
    type: "1BHK" | "2BHK" | "3BHK" | "4BHK";
    images: string[];
    tags: string[];
    lobby: LobbyMember[];
    ownerContact: string;
    isLocked: boolean;
    description: string;
    amenities: string[];
    houseRules: string[];
    distanceToCampus: string;
}

export interface MessVendor {
    id: number;
    name: string;
    rating: number;
    cuisine: string;
    pricePerMonth: number;
    todayMenu: string[];
    image: string;
    description: string;
    deliveryTime: string;
}

export const FLATS: Flat[] = [
    {
        id: 101,
        title: "Sunshine Heights",
        location: "North Campus, Gate 2",
        price: 12500,
        type: "3BHK",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800"
        ],
        tags: ["Furnished", "No Brokerage"],
        lobby: [
            { id: 2, name: "Arjun K.", tags: ["Gamer", "Night Owl"], avatar: "AK", status: "Looking" },
            { id: 3, name: "Priya S.", tags: ["Studious", "Vegan"], avatar: "PS", status: "Looking" },
            { id: 4, name: "Dev M.", tags: ["Gym Rat", "Early Riser"], avatar: "DM", status: "Looking" }
        ],
        ownerContact: "+91 98765 43210",
        isLocked: false,
        description: "Spacious 3BHK with excellent natural light. Located just 5 minutes from the university gate. Recently renovated with modular kitchen coverage.",
        amenities: ["Wi-Fi", "Power Backup", "RO Water", "Geyser", "AC", "Laundry"],
        houseRules: ["No loud music after 11 PM", "Guests allowed until 9 PM", "Keep kitchen clean"],
        distanceToCampus: "200m"
    },
    {
        id: 102,
        title: "The Student Villa",
        location: "South Campus, Satya Niketan",
        price: 9000,
        type: "2BHK",
        images: [
            "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800"
        ],
        tags: ["Semi-Furnished", "Females Only"],
        lobby: [
            { id: 5, name: "Neha R.", tags: ["Artistic", "Chill"], avatar: "NR", status: "Looking" }
        ],
        ownerContact: "+91 98765 43211",
        isLocked: false,
        description: "Cozy 2BHK perfect for students who want a quiet environment. Surrounded by cafes and bookshops.",
        amenities: ["Wi-Fi", "Security Guard", "CCTV", "Water Cooler"],
        houseRules: ["No smoking", "No pets"],
        distanceToCampus: "1.2km"
    },
    {
        id: 103,
        title: "Greenwood Residency",
        location: "GTB Nagar",
        price: 15000,
        type: "4BHK",
        images: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800"
        ],
        tags: ["Luxury", "Fully Furnished"],
        lobby: [
            { id: 6, name: "Rahul V.", tags: ["Coder", "Music"], avatar: "RV", status: "Looking" },
            { id: 7, name: "Sameer K.", tags: ["Fitness", "Cook"], avatar: "SK", status: "Looking" },
            { id: 8, name: "Amit B.", tags: ["Reader"], avatar: "AB", status: "Looking" },
            { id: 9, name: "Vikram S.", tags: ["Gamer"], avatar: "VS", status: "Looking" }
        ],
        ownerContact: "+91 98765 43212",
        isLocked: true,
        description: "Premium living experience with all modern amenities. Includes housekeeping and high-speed internet.",
        amenities: ["Wi-Fi", "AC", "Housekeeping", "Gym", "Power Backup", "Smart TV"],
        houseRules: ["Respect privacy", "Clean up after yourself"],
        distanceToCampus: "800m"
    },
    {
        id: 104,
        title: "Metro View Apartments",
        location: "Vishwavidyalaya Metro",
        price: 11500,
        type: "2BHK",
        images: [
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800"
        ],
        tags: ["Metro Connectivity", "Balcony"],
        lobby: [
            { id: 10, name: "Sanya M.", tags: ["Traveler", "Photo"], avatar: "SM", status: "Looking" },
            { id: 11, name: "Kritika", tags: ["Dancer"], avatar: "KD", status: "Looking" }
        ],
        ownerContact: "+91 98765 43213",
        isLocked: false,
        description: "Right next to the metro station. Perfect for students who travel frequently. Huge balcony with city view.",
        amenities: ["Lift", "Parking", "Geyser", "Balcony"],
        houseRules: ["No late night parties"],
        distanceToCampus: "100m from Metro"
    },
    {
        id: 105,
        title: "Scholar's Den",
        location: "Hudson Lane",
        price: 8500,
        type: "1BHK",
        images: [
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800"
        ],
        tags: ["Budget", "Single Occupancy"],
        lobby: [],
        ownerContact: "+91 98765 43214",
        isLocked: false,
        description: "Compact and affordable 1BHK for solo living. Walking distance to all major coaching centers.",
        amenities: ["Fan", "Lights", "Water Supply"],
        houseRules: ["Pay rent on time"],
        distanceToCampus: "500m"
    }
];

export const MESS_VENDORS: MessVendor[] = [
    {
        id: 501,
        name: "Annapurna Home Foods",
        rating: 4.8,
        cuisine: "North Indian",
        pricePerMonth: 3500,
        todayMenu: ["Paneer Butter Masala", "Jeera Rice", "Dal Fry", "Gulab Jamun"],
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800",
        description: "Authentic North Indian 'Ghar ka Khana'. We use only organic spices and fresh vegetables.",
        deliveryTime: "12:30 PM - 1:30 PM"
    },
    {
        id: 502,
        name: "Spice Route Tiffins",
        rating: 4.5,
        cuisine: "South Indian / Mix",
        pricePerMonth: 3200,
        todayMenu: ["Lemon Rice", "Sambhar", "Aloo Fry", "Curd"],
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800",
        description: "Best South Indian meals in the area. Rotating menu with North Indian dinners.",
        deliveryTime: "12:00 PM - 1:00 PM"
    },
    {
        id: 503,
        name: "Healthy Bowls Co.",
        rating: 4.9,
        cuisine: "Healthy / Salads",
        pricePerMonth: 5000,
        todayMenu: ["Quinoa Salad", "Grilled Chicken/Paneer", "Fresh Juice"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800",
        description: "For the fitness enthusiasts. Calorie-counted meals delivered to your doorstep.",
        deliveryTime: "1:00 PM - 2:00 PM"
    }
];
