/**
 * Centralized PurestStem Business & Brand Configuration.
 * 
 * IMPORTANT:
 * Per brand & privacy policy requirements:
 * - DO NOT display customer email, admin email, or business email on Invoice or AWB.
 * - Use only verified, actual business information from the website.
 */

export const BUSINESS_INFO = {
  brandName: "PurestStem",
  tagline: "60 Years of Mountain Herbalism — Delivered Across Pakistan",
  addressLine1: "Gulberg 3, Eden Tower",
  city: "Lahore",
  country: "Pakistan",
  fullAddress: "Gulberg 3, Eden Tower, Lahore, Pakistan",
  phone: "03334117668",
  websiteUrl: "https://pureststem.com",
  currencySymbol: "Rs",
  currencyCode: "PKR",
  returnPolicyNote: "Products can be verified or exchanged according to PurestStem store policy. Please contact customer care for support.",
} as const;

export type BusinessInfo = typeof BUSINESS_INFO;
