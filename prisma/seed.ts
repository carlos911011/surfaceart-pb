import "dotenv/config";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Support both local SQLite and Turso (cloud)
function resolveDbUrl(): string {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  if (rawUrl.startsWith("file:") && !rawUrl.startsWith("file:/")) {
    const relativePath = rawUrl.slice("file:".length);
    return `file:${path.resolve(process.cwd(), relativePath)}`;
  }
  return rawUrl;
}

const config: { url: string; authToken?: string } = { url: resolveDbUrl() };
if (process.env.TURSO_AUTH_TOKEN) config.authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql(config);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Settings
  const settings = [
    { key: "company_name", value: "SurfaceArt Palm Beach" },
    { key: "company_phone", value: "(561) 000-0000" },
    { key: "company_email", value: "hello@surfaceartpb.com" },
    { key: "company_address", value: "Palm Beach County, FL" },
    { key: "quote_form_enabled", value: "true" },
    {
      key: "email_confirmation_template",
      value: JSON.stringify({
        subject: "Your free quote request has been received — SurfaceArt Palm Beach",
        body: "Hi {{firstName}}, we've received your quote request and will respond within 24 hours.",
      }),
    },
    {
      key: "email_notification_template",
      value: JSON.stringify({
        subject: "🔔 New Quote Request — {{firstName}} {{lastName}} · {{city}}",
        body: "New quote request from {{firstName}} {{lastName}}.",
      }),
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✓ Settings seeded");

  // Testimonials
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Maria G.",
        city: "Palm Beach Gardens",
        service: "Kitchen Wraps",
        rating: 5,
        text: "Absolutely transformed our dated oak kitchen into a stunning modern space. The team was professional, clean, and finished in just 2 days. We saved over $18,000 compared to a full renovation. Highly recommend!",
        isActive: true,
        order: 1,
      },
      {
        clientName: "David & Sarah T.",
        city: "Jupiter",
        service: "Custom TV Wall",
        rating: 5,
        text: "We had a plain white wall behind our TV that always bothered us. SurfaceArt installed a beautiful concrete-look panel and it completely elevated our living room. The quality is incredible.",
        isActive: true,
        order: 2,
      },
      {
        clientName: "Jennifer M.",
        city: "Boca Raton",
        service: "Bathroom Vanities",
        rating: 5,
        text: "Both our master and guest bathrooms got marble-look wraps on the vanities. They look like real stone. My guests always ask if we renovated and are shocked when I tell them it's vinyl. Worth every penny.",
        isActive: true,
        order: 3,
      },
    ],
  });
  console.log("✓ Testimonials seeded");

  // Gallery items
  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: [
      {
        title: "Oak Kitchen → Dark Walnut Transformation",
        service: "Kitchen Wraps",
        city: "Palm Beach Gardens",
        description:
          "18 cabinet doors + 4 drawer fronts transformed from dated oak to rich dark walnut finish.",
        beforeImage: "/images/placeholder-before.jpg",
        afterImage: "/images/placeholder-after.jpg",
        isPublic: true,
        order: 1,
      },
      {
        title: "TV Accent Wall — Concrete Look",
        service: "Custom TV Wall",
        city: "Jupiter",
        description:
          "Plain white wall transformed into an industrial concrete-texture feature wall.",
        beforeImage: "/images/placeholder-before.jpg",
        afterImage: "/images/placeholder-after.jpg",
        isPublic: true,
        order: 2,
      },
      {
        title: "White Bathroom Vanity → Marble",
        service: "Bathroom Vanities",
        city: "Boca Raton",
        description: "Master bath vanity wrapped in Calacatta marble pattern.",
        beforeImage: "/images/placeholder-before.jpg",
        afterImage: "/images/placeholder-after.jpg",
        isPublic: true,
        order: 3,
      },
      {
        title: "Kitchen Island Countertop Wrap",
        service: "Countertop Wraps",
        city: "Wellington",
        description:
          "Laminate countertop wrapped with 3M DI-NOC stone texture.",
        beforeImage: "/images/placeholder-before.jpg",
        afterImage: "/images/placeholder-after.jpg",
        isPublic: true,
        order: 4,
      },
    ],
  });
  console.log("✓ Gallery items seeded");

  // Sample quote requests
  await prisma.quoteRequest.deleteMany();

  const quotes = [
    {
      firstName: "Carlos",
      lastName: "Rodriguez",
      email: "carlos@example.com",
      phone: "(561) 555-0101",
      city: "West Palm Beach",
      propertyType: "Single Family Home",
      services: JSON.stringify(["Kitchen Wraps", "Countertop Wraps"]),
      budget: "$2,500-$5,000",
      description:
        "Looking to wrap our kitchen cabinets (22 doors) in a matte black finish. Also interested in the countertop.",
      hearAboutUs: "Google Search",
      status: "NEW",
    },
    {
      firstName: "Amanda",
      lastName: "Chen",
      email: "amanda@example.com",
      phone: "(561) 555-0202",
      city: "Palm Beach Gardens",
      propertyType: "Condo/Apartment",
      services: JSON.stringify(["Custom TV Wall", "Accent Wall"]),
      budget: "$1,000-$2,500",
      description:
        "Want a wood-panel accent wall in the living room and a concrete-look TV wall.",
      hearAboutUs: "Instagram",
      status: "VIEWED",
    },
    {
      firstName: "Robert",
      lastName: "Williams",
      email: "robert@example.com",
      phone: "(561) 555-0303",
      city: "Jupiter",
      propertyType: "Single Family Home",
      services: JSON.stringify(["Kitchen Wraps"]),
      budget: "$1,000-$2,500",
      description: "12 cabinet doors, looking for a light grey shaker style.",
      hearAboutUs: "Friend/Family Referral",
      status: "QUOTED",
      quotedAmount: 1850,
    },
    {
      firstName: "Patricia",
      lastName: "Martinez",
      email: "patricia@example.com",
      phone: "(561) 555-0404",
      city: "Boca Raton",
      propertyType: "Single Family Home",
      services: JSON.stringify([
        "Kitchen Wraps",
        "Bathroom Vanities",
        "Countertop Wraps",
      ]),
      budget: "$5,000-$10,000",
      description:
        "Full kitchen + 2 bathrooms. Kitchen has 30 cabinet doors. Looking for white oak texture throughout.",
      hearAboutUs: "Google Search",
      status: "WON",
      quotedAmount: 6200,
    },
    {
      firstName: "Michael",
      lastName: "Thompson",
      email: "michael@example.com",
      city: "Wellington",
      propertyType: "Townhouse",
      services: JSON.stringify(["Furniture/Doors"]),
      budget: "Under $1,000",
      description: "3 interior doors, looking for a dark wood finish.",
      hearAboutUs: "Facebook",
      status: "LOST",
    },
  ];

  for (const quote of quotes) {
    await prisma.quoteRequest.create({
      data: {
        ...quote,
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: quote.status,
            note: "Initial status from seed",
          },
        },
      },
    });
  }
  console.log("✓ Quote requests seeded");

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
