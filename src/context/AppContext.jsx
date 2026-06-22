/* eslint-disable */
import React, { createContext, useState, useEffect } from 'react';
import { initializeLocalStorageDB } from '../services/db';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [scans, setScans] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [activeScanReport, setActiveScanReport] = useState(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  // Sync state with LocalStorage
  const loadDataFromStorage = () => {
    initializeLocalStorageDB();

    let u = JSON.parse(localStorage.getItem("glamgo_users") || "[]");
    const p = JSON.parse(localStorage.getItem("glamgo_professionals") || "[]");
    const s = JSON.parse(localStorage.getItem("glamgo_services") || "[]");
    const b = JSON.parse(localStorage.getItem("glamgo_bookings") || "[]");
    const sc = JSON.parse(localStorage.getItem("glamgo_scans") || "[]");

    // Perform database migration to restore original avatars for predefined demo users, tag them, and upgrade structure
    let migrated = false;
    const cleanUsers = u.map(user => {
      let changed = false;
      const next = { ...user };

      const isDemo = ["cust_1", "cust_2", "pro_priya", "pro_amit", "pro_ananya", "pro_rahul", "pro_meera", "admin_1"].includes(next.id);
      if (isDemo) {
        if (!next.isDemoAccount) {
          next.isDemoAccount = true;
          changed = true;
        }
        const demoAvatars = {
          "cust_1": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          "cust_2": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          "pro_priya": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          "pro_amit": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
          "pro_ananya": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          "pro_rahul": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
          "pro_meera": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          "admin_1": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
        };
        const expectedAvatar = demoAvatars[next.id];
        if (next.avatar !== expectedAvatar) {
          next.avatar = expectedAvatar;
          next.avatarUrl = expectedAvatar;
          changed = true;
        }
      } else {
        if (next.avatar && next.avatar.includes("images.unsplash.com")) {
          next.avatar = "";
          changed = true;
        }
        if (next.avatarUrl && next.avatarUrl.includes("images.unsplash.com")) {
          next.avatarUrl = "";
          changed = true;
        }
      }
      if (!next.fullName) {
        next.fullName = next.name || "";
        changed = true;
      }
      if (!next.name) {
        next.name = next.fullName;
        changed = true;
      }
      if (!next.phone) {
        next.phone = "9876543210";
        changed = true;
      }
      if (!next.username) {
        next.username = (next.fullName || "").toLowerCase().replace(/\s+/g, "_");
        changed = true;
      }
      if (!next.createdAt) {
        next.createdAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        changed = true;
      }
      if (next.avatarUrl === undefined) {
        next.avatarUrl = next.avatar || "";
        changed = true;
      }
      if (next.avatar === undefined) {
        next.avatar = next.avatarUrl || "";
        changed = true;
      }
      if (!next.profile) {
        next.profile = {
          gender: next.role === "customer" ? "Female" : "Male",
          dob: "1998-05-15",
          location: next.location || "Pune",
          preferences: next.role === "customer" ? (next.dashboardData?.preferences || {
            skinType: "Dry",
            hairType: "Wavy",
            focus: "Anti-aging",
            productPref: "Organic"
          }) : {}
        };
        changed = true;
      }
      if (!next.location) {
        next.location = next.profile.location || "Pune";
        changed = true;
      }
      if (!next.profile.location) {
        next.profile.location = next.location || "Pune";
        changed = true;
      }

      if (changed) migrated = true;
      return next;
    });

    if (migrated) {
      u = cleanUsers;
      localStorage.setItem("glamgo_users", JSON.stringify(cleanUsers));
    }

    setUsers(u);
    setProfessionals(p);
    setServices(s);
    setBookings(b);
    setScans(sc);

    // Default current user to last selected user if logged in, otherwise start as null
    if (u.length > 0) {
      const storedUserId = localStorage.getItem("glamgo_current_user_id");
      if (storedUserId) {
        const found = u.find(user => user.id === storedUserId);
        setCurrentUser(found || null);
      } else {
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // Switch between roles easily for demo purposes
  const switchUserRole = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("glamgo_current_user_id", userId);
    }
  };

  // Auth: Login User
  const loginUser = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("glamgo_current_user_id", user.id);
      return { success: true, user };
    }
    return { success: false, error: "Invalid email or password." };
  };

  // Auth: Signup User
  const signupUser = (name, email, password, role) => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "Email is already registered on our platform." };
    }

    const newId = (role === 'customer' ? 'cust_' : 'pro_') + Math.random().toString(36).substr(2, 9);
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role,
      avatar: "",
      location: "Pune",
      dashboardData: role === 'customer' ? {
        favorites: { professionals: [], services: [] },
        preferences: { skinType: "Normal", hairType: "Normal", focus: "General Maintenance", productPref: "None" },
        reviews: [],
        analytics: { spending: [0], months: ["Jun"], totalSpend: 0, savings: 0 }
      } : {
        earnings: { monthly: [0], months: ["Jun"], completedServices: 0, retentionRate: 85, payouts: [] },
        schedule: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: "10:00 AM - 06:00 PM" },
        reviews: [],
        aiInsights: { demandForecastingPercentage: 10, pricingOptimizations: [], popularServiceTrends: [], revenueOpportunities: [] }
      }
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("glamgo_users", JSON.stringify(updatedUsers));

    // Auto-login if customer, otherwise onboarding is required
    if (role === 'customer') {
      setCurrentUser(newUser);
      localStorage.setItem("glamgo_current_user_id", newUser.id);
    }

    return { success: true, user: newUser };
  };

  // Auth: Complete Professional Onboarding
  const completeProOnboarding = (proId, onboardingData) => {
    const updatedUsers = users.map(u => {
      if (u.id === proId) {
        return {
          ...u,
          name: onboardingData.salonName || u.name,
          location: onboardingData.location || u.location,
          avatar: onboardingData.profileImage || u.avatar,
          dashboardData: {
            ...u.dashboardData,
            schedule: {
              ...u.dashboardData.schedule,
              hours: onboardingData.workingHours || "10:00 AM - 06:00 PM"
            }
          }
        };
      }
      return u;
    });

    // Create record in professionals registry
    const newProDetails = {
      id: proId,
      specialty: onboardingData.servicesOffered || ["Hair Styling"],
      experienceYears: parseInt(onboardingData.experience, 10) || 5,
      rating: 5.0,
      reviewCount: 0,
      responseTimeMinutes: 10,
      hourlyRate: 1200,
      biography: onboardingData.biography || `Luxury styling treatments by ${onboardingData.salonName}. Specializes in ${(onboardingData.servicesOffered || []).join(', ')}.`,
      portfolio: [
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400"
      ],
      verified: false
    };

    const updatedProfessionals = [...professionals, newProDetails];

    setUsers(updatedUsers);
    setProfessionals(updatedProfessionals);

    localStorage.setItem("glamgo_users", JSON.stringify(updatedUsers));
    localStorage.setItem("glamgo_professionals", JSON.stringify(updatedProfessionals));

    // Log in the user
    const matchedUser = updatedUsers.find(usr => usr.id === proId);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      localStorage.setItem("glamgo_current_user_id", matchedUser.id);
    }
  };

  // Auth: Logout User
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("glamgo_current_user_id");
  };

  // Add Booking
  const addBooking = (bookingData) => {
    const newBooking = {
      id: "b_" + Math.random().toString(36).substr(2, 9),
      customerId: currentUser.id,
      dateTime: bookingData.dateTime,
      status: "upcoming",
      isAiPackage: bookingData.isAiPackage || false,
      packageName: bookingData.packageName || "",
      professionalId: bookingData.professionalId,
      services: bookingData.services,
      totalPrice: bookingData.totalPrice
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem("glamgo_bookings", JSON.stringify(updatedBookings));
    return newBooking;
  };

  // Add AI Scan
  const addScanResult = (scanData) => {
    const scanWithCustomer = {
      ...scanData,
      customerId: currentUser?.id || 'cust_1'
    };
    const updatedScans = [scanWithCustomer, ...scans];
    setScans(updatedScans);
    localStorage.setItem("glamgo_scans", JSON.stringify(updatedScans));
  };

  // Admin Verification Toggle
  const toggleVerification = (proId) => {
    const updatedPros = professionals.map(pro => {
      if (pro.id === proId) {
        return { ...pro, verified: !pro.verified };
      }
      return pro;
    });
    setProfessionals(updatedPros);
    localStorage.setItem("glamgo_professionals", JSON.stringify(updatedPros));
  };

  // Professional Update Price
  const updateServicePrice = (srvId, newPrice) => {
    const updatedSrvs = services.map(s => {
      if (s.id === srvId) {
        return { ...s, price: parseInt(newPrice, 10) };
      }
      return s;
    });
    setServices(updatedSrvs);
    localStorage.setItem("glamgo_services", JSON.stringify(updatedSrvs));
  };

  // Reset to default seed
  const resetToDefaultSeed = () => {
    localStorage.removeItem("glamgo_users");
    localStorage.removeItem("glamgo_professionals");
    localStorage.removeItem("glamgo_services");
    localStorage.removeItem("glamgo_bookings");
    localStorage.removeItem("glamgo_scans");
    loadDataFromStorage();
  };

  // Admin Update User
  const updateUserData = (userId, updatedFields) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        // Enforce alias values for backward compatibility
        const enrichedFields = { ...updatedFields };
        if (enrichedFields.fullName !== undefined) {
          enrichedFields.name = enrichedFields.fullName;
        }
        if (enrichedFields.name !== undefined && enrichedFields.fullName === undefined) {
          enrichedFields.fullName = enrichedFields.name;
        }
        if (enrichedFields.avatarUrl !== undefined) {
          enrichedFields.avatar = enrichedFields.avatarUrl;
        }
        if (enrichedFields.avatar !== undefined && enrichedFields.avatarUrl === undefined) {
          enrichedFields.avatarUrl = enrichedFields.avatar;
        }
        if (enrichedFields.location !== undefined) {
          if (!enrichedFields.profile) enrichedFields.profile = { ...u.profile };
          enrichedFields.profile.location = enrichedFields.location;
        }

        const nextUser = { ...u, ...enrichedFields };

        // Also update currentUser if it is the currently logged-in account
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(nextUser);
        }
        return nextUser;
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem("glamgo_users", JSON.stringify(updatedUsers));
  };

  // Admin Delete User
  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("glamgo_users", JSON.stringify(updatedUsers));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      professionals,
      services,
      bookings,
      scans,
      selectedCity,
      setSelectedCity,
      activeScanReport,
      setActiveScanReport,
      activeDashboardTab,
      setActiveDashboardTab,
      switchUserRole,
      addBooking,
      addScanResult,
      toggleVerification,
      updateServicePrice,
      resetToDefaultSeed,
      updateUserData,
      deleteUser,
      loginUser,
      signupUser,
      completeProOnboarding,
      logoutUser,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
