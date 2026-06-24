// GlamGo AI Integration & Prompt Engineering Layer

import { INITIAL_SERVICES, INITIAL_PROFESSIONALS } from './db';

// ==========================================
// 1. PRODUCTION PROMPT TEMPLATES (Reference)
// ==========================================

export const PROMPTS = {
  // Selfie Analysis prompt
  BEAUTY_SCANNER: `
    You are an expert AI Cosmetic Dermatologist & Hair Consultant.
    Analyze this selfie image and return a JSON containing the following analysis:
    - skinCondition: { score (0-100), label, details (text) }
    - faceShape: { label, details (text) }
    - hairTexture: { score (0-100), label, details (text) }
    - styleSuitability: { label, details (text) }
    - overallScore (0-100)
    - recommendations (string[])
    - suggestedServices (string[] matching categories: "Hair Styling", "Facials", "Makeup", "Nails", "MedSpa")
    
    Make the advice scientific, premium, and actionable. Do not suggest complex surgeries.
  `,

  // Conversational booking prompt
  CONVERSATIONAL_BOOKING: `
    You are a premium AI Beauty Concierge named GlamGo Assistant.
    Analyze the user request and map it to a structured package recommendation:
    User request: "{{USER_REQUEST}}"
    Available services: {{SERVICES_JSON}}
    
    Return a JSON containing:
    - replyText: A warm conversational answer summarizing what you created
    - occasion: The identified event (e.g. Wedding, Party)
    - budgetLimit: Number
    - suggestedServices: Array of service IDs
    - suggestedProfessionals: Array of professional IDs
    - packageTotalPrice: Number
  `,

  // Revenue Forecasting prompt
  REVENUE_ASSISTANT: `
    You are an expert McKinsey & Company startup consultant for beauty professionals.
    Analyze this provider data:
    - Specialties: {{SPECIALTIES}}
    - Historical Bookings: {{BOOKINGS}}
    - Local competitor pricing: {{COMPETITORS}}
    
    Generate:
    - pricingOptimizations: { serviceName, currentPrice, proposedPrice, rationale }[]
    - popularServiceTrends: string[]
    - revenueOpportunities: string[]
    - demandForecastingPercentage: number
  `
};

// ==========================================
// 2. MOCK REAL-TIME INTERACTIVE SIMULATIONS
// ==========================================

// Simulator for Selfie AI Scan
export const simulateBeautyScan = (imageUrl) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create interesting randomized metrics to show dynamic dashboarding
      const skinScores = [82, 91, 74, 88];
      const selectedSkinScore = skinScores[Math.floor(Math.random() * skinScores.length)];

      const faceShapes = ["Oval", "Heart", "Square", "Round"];
      const selectedFaceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];

      const hairScores = [78, 85, 92, 69];
      const selectedHairScore = hairScores[Math.floor(Math.random() * hairScores.length)];

      const results = {
        id: "scan_" + Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400",
        metrics: {
          skinCondition: {
            score: selectedSkinScore,
            label: selectedSkinScore > 85 ? "Optimal Radiance" : "Dehydrated",
            details: selectedSkinScore > 85
              ? "Barrier is strong with healthy sebum balance. Minimal redness."
              : "Mild trans-epidermal water loss detected. Needs deep hyaluronic hydration."
          },
          faceShape: {
            label: selectedFaceShape,
            details: selectedFaceShape === "Oval"
              ? "Perfect symmetry. Suits high contour, swept-back hair, and cat-eye makeup."
              : "Broad forehead tapering to a narrow chin. Suits curtain bangs and soft side waves."
          },
          hairTexture: {
            score: selectedHairScore,
            label: selectedHairScore > 80 ? "Fine Curl Harmony" : "Frizzy Cuticle Damage",
            details: selectedHairScore > 80
              ? "Good cuticle alignment. Minimal split ends."
              : "Exhibits environmental cuticle stress. Keratin replenishment highly recommended."
          },
          styleSuitability: {
            label: "Warm Autumn Glow",
            details: "Copper-brown tones, golden pigments, and earthy nudes amplify your undertone."
          }
        },
        overallScore: Math.round((selectedSkinScore + selectedHairScore) / 2),
        recommendations: [
          "Incorporate a 2% Hyaluronic Acid serum in your AM routine.",
          "Use a silk pillowcase to prevent hair cuticle friction.",
          "Avoid direct heat styling without a thermal protectant spray."
        ],
        suggestedServices: [
          selectedSkinScore < 85 ? "HydraGlow Express Facial" : "Laser Skin Tone Correcting",
          selectedHairScore < 80 ? "Keratin Restructuring Therapy" : "Signature Balayage & Cut",
          "Luxury Bridal Makeover"
        ]
      };

      resolve(results);
    }, 2000); // 2 second mock scanning process
  });
};

// AI Matching Engine Ranker
export const calculateMatchScore = (professional, categoryFilters = []) => {
  let score = 70; // Baseline

  // 1. Rating contribution (up to 15 points)
  score += Math.round((professional.rating / 5.0) * 15);

  // 2. Experience contribution (up to 10 points)
  score += Math.min(professional.experienceYears * 0.8, 10);

  // 3. Response speed contribution (up to 5 points)
  score += Math.max(5 - (professional.responseTimeMinutes / 8), 0);

  // 4. Specialty overlap (up to 10 points)
  if (categoryFilters.length > 0) {
    const matches = professional.specialty.filter(s => categoryFilters.includes(s));
    score += matches.length * 5;
  }

  // Add slight randomized noise so matches feel customized and alive (90-99%)
  score += Math.floor(Math.random() * 5);

  return Math.min(Math.round(score), 99);
};

// Simulator for AI Chat Concierge & Package Builder
export const processChatConcierge = (message, city = "Pune") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMsg = message.toLowerCase();

      // Default parameters
      let occasion = "Personal Style Up";
      let budget = null;
      let replyText;
      let categories = [];

      // Parse budget
      const budgetMatch = lowerMsg.match(/(?:rs\.?|₹|inr)?\s?(\d+)/);
      if (budgetMatch) {
        budget = parseInt(budgetMatch[1], 10);
      } else if (lowerMsg.includes("budget") || lowerMsg.includes("cheap")) {
        budget = 2500;
      }

      // Parse Occasion
      if (lowerMsg.includes("wedding") || lowerMsg.includes("bridal") || lowerMsg.includes("marriage")) {
        occasion = "Wedding";
      } else if (lowerMsg.includes("party") || lowerMsg.includes("night") || lowerMsg.includes("date") || lowerMsg.includes("anniversary")) {
        occasion = "Special Evening Party";
      } else if (lowerMsg.includes("skin") || lowerMsg.includes("glow") || lowerMsg.includes("acne") || lowerMsg.includes("facial")) {
        occasion = "Skin Rejuvenation";
      }

      // Set categories based on occasion
      if (occasion === "Wedding") {
        categories = ["Makeup", "Hair Styling", "Nails"];
      } else if (occasion === "Special Evening Party") {
        categories = ["Makeup", "Nails"];
      } else if (occasion === "Skin Rejuvenation") {
        categories = ["Facials", "Laser & Skin Care"];
      } else {
        categories = ["Hair Styling"];
      }

      // Pick the best Professional based on matched specialties
      const matchedPros = INITIAL_PROFESSIONALS.filter(pro => {
        return pro.specialty.some(spec => categories.includes(spec) || spec.includes("Specialist"));
      });

      const selectedPro = matchedPros[0] || INITIAL_PROFESSIONALS[0];
      const matchScore = calculateMatchScore(selectedPro, categories);

      // Gather Services ONLY from the selected professional
      const allServices = INITIAL_SERVICES;
      const proServices = allServices.filter(s => s.professionalId === selectedPro.id);
      let chosenServices = [];

      if (occasion === "Wedding") {
        const bridalSrv = proServices.find(s => s.id === "srv_priya_1" || s.id === "srv_meera_1") || proServices[0];
        const secondSrv = proServices.find(s => s.id === "srv_priya_2" || s.id === "srv_meera_2") || proServices[1];
        if (bridalSrv) chosenServices.push(bridalSrv);
        if (secondSrv) chosenServices.push(secondSrv);
      } else if (occasion === "Special Evening Party") {
        const partySrv = proServices.find(s => s.id === "srv_priya_2" || s.id === "srv_meera_2") || proServices[0];
        if (partySrv) chosenServices.push(partySrv);
      } else if (occasion === "Skin Rejuvenation") {
        const facSrv = proServices.find(s => s.id === "srv_ananya_1" || s.id === "srv_rahul_1") || proServices[0];
        const secondSrv = proServices.find(s => s.id === "srv_ananya_2") || proServices[1];
        if (facSrv) chosenServices.push(facSrv);
        if (secondSrv) chosenServices.push(secondSrv);
      } else {
        const hairSrv = proServices.find(s => s.id === "srv_amit_1" || s.id === "srv_rahul_1") || proServices[0];
        if (hairSrv) chosenServices.push(hairSrv);
      }

      // Filter by budget if set
      let finalServices = [...chosenServices];
      let sum = finalServices.reduce((a, b) => a + b.price, 0);

      if (budget && sum > budget) {
        // Sort selected professional's services by price and keep only those that fit
        const cheaperServices = proServices.sort((a, b) => a.price - b.price);
        
        let tempServices = [];
        let tempSum = 0;
        for (let s of cheaperServices) {
          if (tempSum + s.price <= budget) {
            tempServices.push(s);
            tempSum += s.price;
          }
        }
        if (tempServices.length === 0 && cheaperServices.length > 0) {
          tempServices = [cheaperServices[0]];
          tempSum = cheaperServices[0].price;
        }
        finalServices = tempServices;
        sum = tempSum;
      }

      const proName = selectedPro.id === 'pro_priya' ? 'Priya Nair' : selectedPro.id === 'pro_amit' ? 'Amit Malhotra' : selectedPro.id === 'pro_ananya' ? 'Ananya Sen' : selectedPro.id === 'pro_rahul' ? 'Rahul Verma' : 'Meera Joshi';
      replyText = `I've designed a custom **${occasion} Package** for you in **${city}**. I selected ${finalServices.length} complementary services that fit perfectly. Based on your preferences, I highly recommend booking with **${proName}** (specialist in ${selectedPro.specialty.join(', ')}). They are a **${matchScore}% match** for your needs!`;

      resolve({
        replyText,
        occasion,
        budgetLimit: budget,
        services: finalServices,
        professional: selectedPro,
        matchScore,
        packageTotalPrice: sum
      });
    }, 1500);
  });
};

// Simulator for Professional AI Revenue Assistant
export const getRevenueAssistantForecast = (proId) => {
  return {
    pricingOptimizations: [
      {
        serviceName: proId === "pro_amit" ? "Signature Balayage & Cut" : "Luxury Bridal Makeover",
        currentPrice: proId === "pro_amit" ? 3999 : 4999,
        proposedPrice: proId === "pro_amit" ? 4499 : 5499,
        rationale: "Wedding and festival season demand is starting. You rank in the top 5% in Pune for styling ratings. Competing salons charge average ₹4800."
      },
      {
        serviceName: proId === "pro_amit" ? "Keratin Restructuring Therapy" : "Glam Evening Makeup",
        currentPrice: proId === "pro_amit" ? 4500 : 2499,
        proposedPrice: proId === "pro_amit" ? 4200 : 2799,
        rationale: "Optimized for quick scheduling during off-peak Tuesdays. Increasing weekday slots will boost retention by 12%."
      }
    ],
    popularServiceTrends: [
      "HydraGlow infusions are up 42% in your city.",
      "Custom acrylic nail extensions with metallic chrome finishes are seeing high weekend booking volumes."
    ],
    revenueOpportunities: [
      "Upsell a post-care hydrating shampoo with coloring treatments (+₹600 avg ticket).",
      "Offer a 'Mid-Week Glam' bundle to reduce slot vacancies on Mondays and Tuesdays."
    ],
    demandForecastingPercentage: 18 // Expecting 18% increase next month
  };
};
