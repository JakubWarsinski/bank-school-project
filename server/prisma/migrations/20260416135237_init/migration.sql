-- CreateTable
CREATE TABLE "reset_token" (
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expire_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
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
    "password_hash" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "sessions" (
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT NOT NULL,
    "device" TEXT,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "iban" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Konto osobiste',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "current_balance" DECIMAL NOT NULL DEFAULT 0.0,
    "available_balance" DECIMAL NOT NULL DEFAULT 0.0,
    "blocked_amount" DECIMAL NOT NULL DEFAULT 0.0,
    "daily_transfer_limit" DECIMAL NOT NULL DEFAULT 0.0,
    "closed_at" DATETIME,
    "closed_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "user_account_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OWNER',
    CONSTRAINT "user_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("account_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL DEFAULT 'INTERNAL_TRANSFER',
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL,
    "booking_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "accounts" ("account_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "accounts" ("account_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cards" (
    "card_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Moja Karta',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "card_number_hash" TEXT NOT NULL,
    "last_digits" TEXT NOT NULL,
    "cvv_hash" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "expiry_month" INTEGER NOT NULL,
    "expiry_year" INTEGER NOT NULL,
    "payment_limit" DECIMAL NOT NULL DEFAULT 5000.0,
    "withdraw_limit" DECIMAL NOT NULL DEFAULT 5000.0,
    "daily_payment_limit" DECIMAL NOT NULL DEFAULT 500.0,
    "daily_withdraw_limit" DECIMAL NOT NULL DEFAULT 500.0,
    "blocked_at" DATETIME,
    "blocked_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cards_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("account_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_user_id_key" ON "reset_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "kod klienta" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pesel" ON "users"("pesel");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_code_pesel_idx" ON "users"("email", "code", "pesel");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_user_id_key" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "iban" ON "accounts"("iban");

-- CreateIndex
CREATE INDEX "accounts_iban_idx" ON "accounts"("iban");

-- CreateIndex
CREATE UNIQUE INDEX "account_id_user_id" ON "user_accounts"("account_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "kod transakcji" ON "transactions"("code");

-- CreateIndex
CREATE INDEX "transactions_code_sender_id_receiver_id_idx" ON "transactions"("code", "sender_id", "receiver_id");
