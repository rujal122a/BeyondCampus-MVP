
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
    coordinates?: { lat: number; lng: number };
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
    coordinates?: { lat: number; lng: number };
}

export const FLATS: Flat[] = [
    {
        id: 101,
        title: "Sunshine Heights",
        location: "Vishrambag, near WCE Gate 1",
        price: 3500,
        type: "3BHK",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800"
        ],
        tags: ["Furnished"],
        lobby: [
            { id: 2, name: "Arjun K.", tags: ["Gamer", "Night Owl"], avatar: "AK", status: "Looking" },
            { id: 3, name: "Priya S.", tags: ["Studious", "Vegan"], avatar: "PS", status: "Looking" },
            { id: 4, name: "Dev M.", tags: ["Gym Rat", "Early Riser"], avatar: "DM", status: "Looking" }
        ],
        ownerContact: "+91 98765 43210",
        isLocked: false,
        description: "Spacious 3BHK with excellent natural light. Located just 2 minutes walking distance from WCE via the back gate.",
        amenities: ["Wi-Fi", "Power Backup", "RO Water", "Geyser", "AC", "Laundry"],
        houseRules: ["No loud music after 11 PM", "Guests allowed until 9 PM", "Keep kitchen clean"],
        distanceToCampus: "200m",
        coordinates: { lat: 16.8420, lng: 74.6010 }
    },
    {
        id: 102,
        title: "The Student Villa",
        location: "Wanlesswadi, High School Road",
        price: 2500,
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
        description: "Cozy 2BHK perfect for students who want a quiet environment. Surrounded by cafes and bookshops near College Corner.",
        amenities: ["Wi-Fi", "Security Guard", "CCTV", "Water Cooler"],
        houseRules: ["No smoking", "No pets"],
        distanceToCampus: "1.2km",
        coordinates: { lat: 16.8350, lng: 74.6100 }
    },
    {
        id: 103,
        title: "Greenwood Residency",
        location: "Kalanagar, Sangli",
        price: 4500,
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
        distanceToCampus: "800m",
        coordinates: { lat: 16.8500, lng: 74.6050 }
    },
    {
        id: 104,
        title: "Metro View Apartments",
        location: "100ft Road, Near D Mart",
        price: 3000,
        type: "2BHK",
        images: [
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800"
        ],
        tags: ["Shopping Access", "Balcony"],
        lobby: [
            { id: 10, name: "Sanya M.", tags: ["Traveler", "Photo"], avatar: "SM", status: "Looking" },
            { id: 11, name: "Kritika", tags: ["Dancer"], avatar: "KD", status: "Looking" }
        ],
        ownerContact: "+91 98765 43213",
        isLocked: false,
        description: "Right next to D Mart. Perfect for shopping and easy transport. Huge balcony with city view.",
        amenities: ["Lift", "Parking", "Geyser", "Balcony"],
        houseRules: ["No late night parties"],
        distanceToCampus: "1.5km",
        coordinates: { lat: 16.8550, lng: 74.6200 }
    },
    {
        id: 105,
        title: "Scholar's Den",
        location: "College Corner",
        price: 2200,
        type: "1BHK",
        images: [
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800"
        ],
        tags: ["Budget", "Single Occupancy"],
        lobby: [],
        ownerContact: "+91 98765 43214",
        isLocked: false,
        description: "Compact and affordable 1BHK for solo living. Walking distance to all major practical labs.",
        amenities: ["Fan", "Lights", "Water Supply"],
        houseRules: ["Pay rent on time"],
        distanceToCampus: "100m",
        coordinates: { lat: 16.8470, lng: 74.6025 }
    }
];

export const MESS_VENDORS: MessVendor[] = [
    {
        id: 501,
        name: "Annapurna Home Foods",
        rating: 4.8,
        cuisine: "Maharashtrian",
        pricePerMonth: 2800,
        todayMenu: ["Puran Poli", "Katachi Amti", "Rice", "Batata Bhaji"],
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800",
        description: "Authentic Maharashtrian 'Ghar ka Jevan'. We use only organic spices and fresh vegetables.",
        deliveryTime: "12:30 PM - 1:30 PM",
        coordinates: { lat: 16.8430, lng: 74.6000 }
    },
    {
        id: 502,
        name: "Kulkarni Mess",
        rating: 4.5,
        cuisine: "Brahmin Special",
        pricePerMonth: 2500,
        todayMenu: ["Varan Bhaat", "Chapati", "Methi Bhaji", "Taak"],
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800",
        description: "Simple, sattvic, and hygienic meals. Best for daily consumption.",
        deliveryTime: "12:00 PM - 1:00 PM",
        coordinates: { lat: 16.8460, lng: 74.6030 }
    },
    {
        id: 503,
        name: "Kolhapur Zanka",
        rating: 4.9,
        cuisine: "Spicy / Non-Veg",
        pricePerMonth: 3500,
        todayMenu: ["Tambda Pandhra Rassa", "Chicken Thali", "Bhakri"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800",
        description: "For the spicy food lovers. Authentic Kolhapuri taste delivered on weeekends.",
        deliveryTime: "1:00 PM - 2:00 PM",
        coordinates: { lat: 16.8400, lng: 74.6050 }
    }
];
