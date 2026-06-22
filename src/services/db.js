// GlamGo AI Seed Database & Data Layer

export const CITIES = ["Pune"];

export const SPECIALTIES = [
  "Hair Styling",
  "Facials",
  "Makeup",
  "Nails",
  "MedSpa",
  "Laser & Skin Care",
  "Bridal Specialist"
];

export const INITIAL_USERS = [
  // Customers
  {
    id: "cust_1",
    name: "Rhea Sharma",
    email: "rhea@example.com",
    password: "password123",
    role: "customer",
    avatar: "",
    location: "Pune",
    dashboardData: {
      favorites: {
        professionals: ["pro_amit", "pro_priya"],
        services: ["srv_amit_1", "srv_priya_2"]
      },
      preferences: {
        skinType: "Dry & Sensitive",
        hairType: "Color-Treated, Wavy",
        focus: "Skin Hydration & Hair Cuticle Repair",
        productPref: "Organic, Sulfate-free, Chilled treatments"
      },
      reviews: [
        {
          id: "rev_cust_1_1",
          professionalId: "pro_amit",
          rating: 5,
          text: "Amit is a hair magician! The Balayage came out exactly like I wanted. Beautiful gradient.",
          date: "2026-05-11"
        },
        {
          id: "rev_cust_1_2",
          professionalId: "pro_priya",
          rating: 5,
          text: "Priya did a spectacular job for my sister's reception makeup. Extremely professional!",
          date: "2026-06-16"
        }
      ],
      analytics: {
        spending: [1500, 2400, 1800, 4200, 3999, 6498],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        totalSpend: 20497,
        savings: 2400
      }
    }
  },
  {
    id: "cust_2",
    name: "Aarav Mehta",
    email: "aarav@example.com",
    password: "password123",
    role: "customer",
    avatar: "",
    location: "Pune",
    dashboardData: {
      favorites: {
        professionals: ["pro_rahul", "pro_ananya"],
        services: ["srv_rahul_1", "srv_ananya_1"]
      },
      preferences: {
        skinType: "Oily & Acne-Prone",
        hairType: "Thick, Straight",
        focus: "Deep Cleansing & Scalp Health",
        productPref: "Citrusy, Tea Tree Oil, Non-comedogenic"
      },
      reviews: [
        {
          id: "rev_cust_2_1",
          professionalId: "pro_rahul",
          rating: 4,
          text: "Rahul Verma did a great job matching my hair color. Very quick and neat.",
          date: "2026-06-02"
        }
      ],
      analytics: {
        spending: [900, 1200, 0, 1999, 999, 1999],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        totalSpend: 7097,
        savings: 850
      }
    }
  },

  // Professionals
  {
    id: "pro_priya",
    name: "Priya Nair",
    email: "priya@glamgo.ai",
    password: "password123",
    role: "professional",
    avatar: "",
    location: "Pune",
    dashboardData: {
      earnings: {
        monthly: [45000, 65000, 72000, 95000, 84000, 120000],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        completedServices: 82,
        retentionRate: 91,
        payouts: [
          { id: "pay_priya_1", date: "2026-06-01", amount: 84000, status: "Paid" },
          { id: "pay_priya_2", date: "2026-05-01", amount: 95000, status: "Paid" }
        ]
      },
      schedule: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        hours: "10:00 AM - 06:00 PM"
      },
      reviews: [
        {
          id: "rev_pro_priya_1",
          customerName: "Rhea Sharma",
          customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          rating: 5,
          text: "Priya did a spectacular job for my sister's reception makeup. Extremely professional!",
          date: "2026-06-16"
        }
      ],
      aiInsights: {
        demandForecastingPercentage: 35,
        pricingOptimizations: [
          {
            serviceName: "Luxury Bridal Makeover",
            currentPrice: 4999,
            proposedPrice: 5499,
            rationale: "High demand during wedding season peak in Pune area suggests local room for 10% rate optimization."
          }
        ],
        popularServiceTrends: [
          "Airbrush and HD makeup requests rose 40% globally in bridal services.",
          "Brides in Pune favor warm undertones with gold foil accents this season."
        ],
        revenueOpportunities: [
          "Offer pre-wedding skincare consultations as a 15% addon to Bridal Makeover.",
          "Promote package discounts on bundling Bridal Makeover + Nail Art styling."
        ]
      }
    }
  },
  {
    id: "pro_amit",
    name: "Amit Malhotra",
    email: "amit@glamgo.ai",
    password: "password123",
    role: "professional",
    avatar: "",
    location: "Pune",
    dashboardData: {
      earnings: {
        monthly: [35000, 58000, 51000, 76000, 88000, 114000],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        completedServices: 110,
        retentionRate: 84,
        payouts: [
          { id: "pay_amit_1", date: "2026-06-01", amount: 88000, status: "Paid" },
          { id: "pay_amit_2", date: "2026-05-01", amount: 76000, status: "Paid" }
        ]
      },
      schedule: {
        days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"],
        hours: "11:00 AM - 08:00 PM"
      },
      reviews: [
        {
          id: "rev_pro_amit_1",
          customerName: "Rhea Sharma",
          customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          rating: 5,
          text: "Amit is a hair magician! The Balayage came out exactly like I wanted. Beautiful gradient.",
          date: "2026-05-11"
        }
      ],
      aiInsights: {
        demandForecastingPercentage: 18,
        pricingOptimizations: [
          {
            serviceName: "Signature Balayage & Cut",
            currentPrice: 3999,
            proposedPrice: 4299,
            rationale: "Local colorist rates are rising. Your high rating (4.7) allows a premium raise."
          }
        ],
        popularServiceTrends: [
          "Wavy textures with dynamic curtain bangs are trending in haircut requests.",
          "Copper balayage color tones represent Pune's fastest growing hair color query."
        ],
        revenueOpportunities: [
          "Offer Keratin restructuring treatments at a 20% discount when booked with global color.",
          "Introduce post-color maintenance shampoos to boost product sales margins."
        ]
      }
    }
  },
  {
    id: "pro_ananya",
    name: "Ananya Sen",
    email: "ananya@glamgo.ai",
    password: "password123",
    role: "professional",
    avatar: "",
    location: "Pune",
    dashboardData: {
      earnings: {
        monthly: [50000, 62000, 58000, 90000, 95000, 135000],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        completedServices: 65,
        retentionRate: 89,
        payouts: [
          { id: "pay_ananya_1", date: "2026-06-01", amount: 95000, status: "Paid" },
          { id: "pay_ananya_2", date: "2026-05-01", amount: 90000, status: "Paid" }
        ]
      },
      schedule: {
        days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        hours: "09:00 AM - 05:00 PM"
      },
      reviews: [],
      aiInsights: {
        demandForecastingPercentage: 25,
        pricingOptimizations: [
          {
            serviceName: "HydraGlow Express Facial",
            currentPrice: 2999,
            proposedPrice: 3299,
            rationale: "Pune high skin hydration requests due to dry weather suggest local pricing leverage."
          }
        ],
        popularServiceTrends: [
          "Clinical skincare treatments like chemical peeling see a 50% year-on-year surge.",
          "Chilled hydration masks are highly requested for post-laser facial repair."
        ],
        revenueOpportunities: [
          "Offer custom barrier repair serum take-home bottles to facial clients.",
          "Create a laser skin tone packages of 3 sessions with a 15% upfront discount."
        ]
      }
    }
  },
  {
    id: "pro_rahul",
    name: "Rahul Verma",
    email: "rahul@glamgo.ai",
    password: "password123",
    role: "professional",
    avatar: "",
    location: "Pune",
    dashboardData: {
      earnings: {
        monthly: [25000, 31000, 42000, 39000, 45000, 68000],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        completedServices: 90,
        retentionRate: 75,
        payouts: [
          { id: "pay_rahul_1", date: "2026-06-01", amount: 45000, status: "Paid" }
        ]
      },
      schedule: {
        days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        hours: "10:00 AM - 08:00 PM"
      },
      reviews: [
        {
          id: "rev_pro_rahul_1",
          customerName: "Aarav Mehta",
          customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          rating: 4,
          text: "Rahul Verma did a great job matching my hair color. Very quick and neat.",
          date: "2026-06-02"
        }
      ],
      aiInsights: {
        demandForecastingPercentage: 15,
        pricingOptimizations: [
          {
            serviceName: "Global Hair Coloring",
            currentPrice: 1999,
            proposedPrice: 2199,
            rationale: "Rising cost of premium coloring dyes allows standard price adjustment."
          }
        ],
        popularServiceTrends: [
          "Grooming express facials are highly selected by male salon clients in the city.",
          "Anti-dandruff oil therapies represent major recurring seasonal treatments."
        ],
        revenueOpportunities: [
          "Upsell global hair coloring clients with deep conditioning treatments for color lock.",
          "Promote Father's Day hair trim + scalp cooling massage bundles."
        ]
      }
    }
  },
  {
    id: "pro_meera",
    name: "Meera Joshi",
    email: "meera@glamgo.ai",
    password: "password123",
    role: "professional",
    avatar: "",
    location: "Pune",
    dashboardData: {
      earnings: {
        monthly: [28000, 32000, 48000, 62000, 58000, 89000],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        completedServices: 125,
        retentionRate: 92,
        payouts: [
          { id: "pay_meera_1", date: "2026-06-01", amount: 58000, status: "Paid" }
        ]
      },
      schedule: {
        days: ["Thursday", "Friday", "Saturday", "Sunday", "Monday"],
        hours: "11:00 AM - 07:00 PM"
      },
      reviews: [],
      aiInsights: {
        demandForecastingPercentage: 30,
        pricingOptimizations: [
          {
            serviceName: "Custom Acrylic Nail Extensions",
            currentPrice: 1899,
            proposedPrice: 2099,
            rationale: "Excellent reviews and high retention rate of 92% give strong pricing leverage."
          }
        ],
        popularServiceTrends: [
          "Cat-eye chrome overlays and 3D nail gem designs are peaking in Pune's luxury nail market.",
          "Builder gel overlay requests see a 60% surge to replace traditional acrylic layers."
        ],
        revenueOpportunities: [
          "Offer custom hand lotion massage addons at a low delivery cost.",
          "Encourage nail extensions maintenance package bundles for recurring bi-weekly bookings."
        ]
      }
    }
  },

  // Admin
  {
    id: "admin_1",
    name: "Karan Johar",
    email: "karan@glamgo.ai",
    password: "password123",
    role: "admin",
    avatar: "",
    location: "Pune",
    dashboardData: {
      platform: {
        systemHealth: "100%",
        activePartners: 5,
        unverifiedCount: 1,
        totalGmv: 6498,
        activeUserCount: 8
      }
    }
  }
];

export const INITIAL_PROFESSIONALS = [
  {
    id: "pro_priya",
    specialty: ["Makeup", "Bridal Specialist"],
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 124,
    responseTimeMinutes: 5,
    hourlyRate: 1500,
    biography: "Vogue-featured bridal makeup expert. 8+ years styling elite clientele in Pune. Specializes in HD Makeup, Airbrush, and contemporary skin finishes.",
    portfolio: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
    ],
    verified: true
  },
  {
    id: "pro_amit",
    specialty: ["Hair Styling"],
    experienceYears: 12,
    rating: 4.7,
    reviewCount: 98,
    responseTimeMinutes: 10,
    hourlyRate: 1200,
    biography: "Ex-creative head at Salon Luxe. Expert colorist and haircut designer. Master of balayage, keratin therapy, and dynamic modern hair architectures.",
    portfolio: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=400"
    ],
    verified: true
  },
  {
    id: "pro_ananya",
    specialty: ["Facials", "Laser & Skin Care", "MedSpa"],
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 74,
    responseTimeMinutes: 15,
    hourlyRate: 2000,
    biography: "Certified aesthetician specializing in clinical skin facials, chemical peels, and laser resurfacing treatments. Focused on science-backed skin glow.",
    portfolio: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400"
    ],
    verified: true
  },
  {
    id: "pro_rahul",
    specialty: ["Hair Styling", "Facials"],
    experienceYears: 5,
    rating: 4.5,
    reviewCount: 45,
    responseTimeMinutes: 20,
    hourlyRate: 900,
    biography: "Dynamic groomer & hair architect. Specializes in hair coloring, texturizing, and express hydration facials for the modern go-getter.",
    portfolio: [
      "https://images.unsplash.com/photo-1605497746444-ac9dbd324ce9?w=400"
    ],
    verified: false
  },
  {
    id: "pro_meera",
    specialty: ["Nails", "Makeup"],
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 140,
    responseTimeMinutes: 8,
    hourlyRate: 1100,
    biography: "Nail art champion. Master of acrylic extension, custom gel overlays, and hyper-detailed nail sculptures. Highly passionate about accent details.",
    portfolio: [
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400",
      "https://images.unsplash.com/photo-1632345031435-8797b2d58045?w=400"
    ],
    verified: true
  }
];

export const INITIAL_SERVICES = [
  // Priya's Services
  {
    id: "srv_priya_1",
    professionalId: "pro_priya",
    name: "Luxury Bridal Makeover",
    category: "Makeup",
    price: 4999,
    durationMinutes: 120,
    description: "Full bridal design including HD skin finish, contouring, premium lashes, hairstyling advice, and draping support."
  },
  {
    id: "srv_priya_2",
    professionalId: "pro_priya",
    name: "Glam Evening Makeup",
    category: "Makeup",
    price: 2499,
    durationMinutes: 60,
    description: "Premium party makeup, smoky/glitter eyes, sculpted skin with high-end global beauty brands."
  },

  // Amit's Services
  {
    id: "srv_amit_1",
    professionalId: "pro_amit",
    name: "Signature Balayage & Cut",
    category: "Hair Styling",
    price: 3999,
    durationMinutes: 150,
    description: "Custom hand-painted highlights tailored to face shape, coupled with a signature designer styling haircut."
  },
  {
    id: "srv_amit_2",
    professionalId: "pro_amit",
    name: "Keratin Restructuring Therapy",
    category: "Hair Styling",
    price: 4500,
    durationMinutes: 180,
    description: "Deep infusing protein hair treatment that eliminates frizz, restores volume shine, and repairs structural bonds."
  },

  // Ananya's Services
  {
    id: "srv_ananya_1",
    professionalId: "pro_ananya",
    name: "HydraGlow Express Facial",
    category: "Facials",
    price: 2999,
    durationMinutes: 75,
    description: "Multi-stage skin vacuum cleansing, chemical exfoliation, serum infusion, and chilled hydration therapy."
  },
  {
    id: "srv_ananya_2",
    professionalId: "pro_ananya",
    name: "Laser Skin Tone Correcting",
    category: "Laser & Skin Care",
    price: 4999,
    durationMinutes: 45,
    description: "Non-invasive laser therapy targeting redness, sunspots, and hyperpigmentation. Safe skin rejuvenation."
  },

  // Rahul's Services
  {
    id: "srv_rahul_1",
    professionalId: "pro_rahul",
    name: "Global Hair Coloring",
    category: "Hair Styling",
    price: 1999,
    durationMinutes: 90,
    description: "Rich all-over root touchup or global color matching including high gloss protectant wash."
  },

  // Meera's Services
  {
    id: "srv_meera_1",
    professionalId: "pro_meera",
    name: "Custom Acrylic Nail Extensions",
    category: "Nails",
    price: 1899,
    durationMinutes: 90,
    description: "Gel extensions or acrylic extensions with custom chrome styling, rhinestones, or hand-painted art."
  },
  {
    id: "srv_meera_2",
    professionalId: "pro_meera",
    name: "Gel Polish Overlay & Mani",
    category: "Nails",
    price: 999,
    durationMinutes: 45,
    description: "Classic clean Russian manicure, base coat strengthening, and premium long-lasting gel polish finish."
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "b_1",
    customerId: "cust_1",
    professionalId: "pro_priya",
    services: [
      {
        id: "srv_priya_2",
        name: "Glam Evening Makeup",
        price: 2499,
        category: "Makeup"
      }
    ],
    dateTime: "2026-06-15T16:00:00.000Z",
    status: "upcoming",
    totalPrice: 2499,
    isAiPackage: false
  },
  {
    id: "b_2",
    customerId: "cust_1",
    professionalId: "pro_amit",
    services: [
      {
        id: "srv_amit_1",
        name: "Signature Balayage & Cut",
        price: 3999,
        category: "Hair Styling"
      }
    ],
    dateTime: "2026-05-10T11:00:00.000Z",
    status: "completed",
    totalPrice: 3999,
    isAiPackage: false
  }
];

// Helper to seed standard localStorage database
export const initializeLocalStorageDB = () => {
  const getParsedItem = (key) => {
    try {
      const val = localStorage.getItem(key);
      if (!val) return null;
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length === 0) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  if (!getParsedItem("glamgo_users")) {
    localStorage.setItem("glamgo_users", JSON.stringify(INITIAL_USERS));
  }
  if (!getParsedItem("glamgo_professionals")) {
    localStorage.setItem("glamgo_professionals", JSON.stringify(INITIAL_PROFESSIONALS));
  }
  if (!getParsedItem("glamgo_services")) {
    localStorage.setItem("glamgo_services", JSON.stringify(INITIAL_SERVICES));
  }
  if (!getParsedItem("glamgo_bookings")) {
    localStorage.setItem("glamgo_bookings", JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem("glamgo_scans")) {
    localStorage.setItem("glamgo_scans", JSON.stringify([]));
  }
};
