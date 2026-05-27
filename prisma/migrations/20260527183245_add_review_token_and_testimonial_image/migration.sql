-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuoteRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "budget" TEXT,
    "description" TEXT,
    "hearAboutUs" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "quotedAmount" REAL,
    "visitDate" DATETIME,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "reviewToken" TEXT
);
INSERT INTO "new_QuoteRequest" ("budget", "city", "createdAt", "description", "email", "firstName", "hearAboutUs", "id", "internalNotes", "ipAddress", "lastName", "phone", "propertyType", "quotedAmount", "services", "status", "updatedAt", "userAgent", "visitDate") SELECT "budget", "city", "createdAt", "description", "email", "firstName", "hearAboutUs", "id", "internalNotes", "ipAddress", "lastName", "phone", "propertyType", "quotedAmount", "services", "status", "updatedAt", "userAgent", "visitDate" FROM "QuoteRequest";
DROP TABLE "QuoteRequest";
ALTER TABLE "new_QuoteRequest" RENAME TO "QuoteRequest";
CREATE UNIQUE INDEX "QuoteRequest_reviewToken_key" ON "QuoteRequest"("reviewToken");
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "quoteId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Testimonial" ("city", "clientName", "createdAt", "id", "isActive", "order", "rating", "service", "text") SELECT "city", "clientName", "createdAt", "id", "isActive", "order", "rating", "service", "text" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
CREATE UNIQUE INDEX "Testimonial_quoteId_key" ON "Testimonial"("quoteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
