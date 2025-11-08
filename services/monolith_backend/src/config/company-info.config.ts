import { registerAs } from "@nestjs/config";

export const companyInfo = {
  name: "RIRA INDUSTRIES PRIVATE LIMITED",
  shortName: "Tiffin Wale",
  website: "www.tiffin-wale.com",
  email: "contact@tiffin-wale.com",
  phone: "+91 91311 14837",
  address: {
    line1: "23, Vijay Nagar",
    city: "Indore",
    state: "Madhya Pradesh",
    zip: "452010",
  },
  tagline: "Ghar Jaisa Khana Har Jagah",
};

export default registerAs("companyInfo", () => companyInfo);
