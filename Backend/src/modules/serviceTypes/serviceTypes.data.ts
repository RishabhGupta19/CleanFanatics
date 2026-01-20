import { ServiceCategory } from "../bookings/booking.types";

export const SERVICE_TYPES = [
  { id: "cleaning-basic", name: "Basic Home Cleaning", category: ServiceCategory.CLEANING, basePrice: 500 },
  { id: "cleaning-deep", name: "Deep Cleaning", category: ServiceCategory.CLEANING, basePrice: 1200 },
  { id: "cleaning-kitchen", name: "Kitchen Cleaning", category: ServiceCategory.CLEANING, basePrice: 800 },
  { id: "cleaning-bathroom", name: "Bathroom Cleaning", category: ServiceCategory.CLEANING, basePrice: 700 },

  { id: "repair-electric", name: "Electrical Repair", category: ServiceCategory.REPAIR_MAINTENANCE, basePrice: 600 },
  { id: "repair-plumbing", name: "Plumbing Repair", category: ServiceCategory.REPAIR_MAINTENANCE, basePrice: 650 },
  { id: "repair-ac", name: "AC Repair & Service", category: ServiceCategory.REPAIR_MAINTENANCE, basePrice: 1500 },
  { id: "repair-appliance", name: "Appliance Repair", category: ServiceCategory.REPAIR_MAINTENANCE, basePrice: 1000 },

  { id: "beauty-haircut", name: "Haircut at Home", category: ServiceCategory.BEAUTY_WELLNESS, basePrice: 400 },
  { id: "beauty-facial", name: "Facial & Skincare", category: ServiceCategory.BEAUTY_WELLNESS, basePrice: 900 },
  { id: "beauty-massage", name: "Body Massage", category: ServiceCategory.BEAUTY_WELLNESS, basePrice: 1200 },
  { id: "beauty-makeup", name: "Party Makeup", category: ServiceCategory.BEAUTY_WELLNESS, basePrice: 2000 },
];
