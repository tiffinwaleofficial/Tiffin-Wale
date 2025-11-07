import { registerAs } from "@nestjs/config";

export const companyInfo = {
  name: "RI RA INDUSTRIES PRIVATE LIMITED",
  shortName: "Tiffin Wale",
  website: "www.tiffinwale.com",
  email: "contact@tiffinwale.com",
  phone: "+91 99999 99999",
  address: {
    line1: "23, Vijay Nagar",
    city: "Indore",
    state: "Madhya Pradesh",
    zip: "452010",
  },
  tagline: "Ghar Jaisa Khana Har Jagah",
};

export default registerAs("companyInfo", () => companyInfo);
