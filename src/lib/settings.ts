import { cache } from "react";
import { prisma } from "./prisma";

export type PublicSettings = {
  company_name: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  instagram_url: string;
  facebook_url: string;
  quote_form_enabled: string;
  response_time_hours: string;
};

const DEFAULTS: PublicSettings = {
  company_name: "SurfaceArt Palm Beach",
  company_phone: "(561) 000-0000",
  company_email: "hello@surfaceartpb.com",
  company_address: "Palm Beach County, FL",
  instagram_url: "",
  facebook_url: "",
  quote_form_enabled: "true",
  response_time_hours: "24",
};

// cache() deduplicates calls within a single request
export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: Object.keys(DEFAULTS) } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULTS, ...map } as PublicSettings;
  } catch {
    return DEFAULTS;
  }
});
