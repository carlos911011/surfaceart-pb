import { z } from "zod";

export const CITIES = [
  "West Palm Beach",
  "Palm Beach Gardens",
  "Jupiter",
  "Wellington",
  "Boca Raton",
  "Delray Beach",
  "Boynton Beach",
  "Lake Worth",
  "Royal Palm Beach",
  "Other Palm Beach County",
] as const;

export const PROPERTY_TYPES = [
  "Single Family Home",
  "Condo/Apartment",
  "Townhouse",
  "Commercial Space",
  "Rental Property",
  "Other",
] as const;

export const SERVICES = [
  "Kitchen Wraps",
  "Custom TV Wall",
  "Accent Wall",
  "Bathroom Vanity",
  "Countertop Wrap",
  "Furniture/Doors",
  "Full Interior Package",
  "Not sure yet",
] as const;

export const BUDGETS = [
  "Under $1,000",
  "$1,000-$2,500",
  "$2,500-$5,000",
  "$5,000-$10,000",
  "$10,000+",
  "Prefer not to say",
] as const;

export const HEAR_ABOUT_US = [
  "Google Search",
  "Instagram",
  "TikTok",
  "Facebook",
  "Nextdoor",
  "Friend/Family Referral",
  "Realtor Referral",
  "Other",
] as const;

export const QuoteSubmitSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).optional(),
  city: z.enum(CITIES, { message: "Please select a city" }),
  propertyType: z.enum(PROPERTY_TYPES, { message: "Please select a property type" }),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  budget: z.string().optional(),
  description: z.string().max(2000).optional(),
  hearAboutUs: z.string().optional(),
});

export type QuoteSubmitInput = z.infer<typeof QuoteSubmitSchema>;
