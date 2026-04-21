-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "pesel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "password_hash" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "id_card_number" TEXT,
    "id_card_issue" DATETIME,
    "id_card_expiry" DATETIME,
    "profession" TEXT,
    "monthly_net_income" TEXT,
    "main_income_sources" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("city", "code", "created_at", "date_of_birth", "email", "first_name", "id_card_expiry", "id_card_issue", "id_card_number", "is_active", "last_name", "main_income_sources", "monthly_net_income", "password_hash", "pesel", "phone_number", "postal_code", "profession", "role", "street", "updated_at", "user_id") SELECT "city", "code", "created_at", "date_of_birth", "email", "first_name", "id_card_expiry", "id_card_issue", "id_card_number", "is_active", "last_name", "main_income_sources", "monthly_net_income", "password_hash", "pesel", "phone_number", "postal_code", "profession", "role", "street", "updated_at", "user_id" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "kod klienta" ON "users"("code");
CREATE UNIQUE INDEX "pesel" ON "users"("pesel");
CREATE UNIQUE INDEX "email" ON "users"("email");
CREATE INDEX "users_email_code_pesel_idx" ON "users"("email", "code", "pesel");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
