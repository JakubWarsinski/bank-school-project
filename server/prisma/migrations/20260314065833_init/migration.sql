-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('OWNER', 'CO_OWNER');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'BLOCKED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INTERNAL_TRANSFER', 'CARD_PAYMENT', 'CARD_WITHDRAWAL', 'ADJUSTMENT', 'REVERSAL');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'BLOCKED_BY_USER', 'BLOCKED_BY_BANK', 'STOLEN', 'LOST', 'EXPIRED', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'SECURITY', 'TRANSACTION', 'ACCOUNT', 'CARD');

-- CreateTable
CREATE TABLE "reset_token" (
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "code" CHAR(16) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "pesel" CHAR(11) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "phone_number" VARCHAR(11) NOT NULL,
    "street" VARCHAR(80) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "postal_code" CHAR(6) NOT NULL,
    "password_hash" VARCHAR(254) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT NOT NULL,
    "device" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" SERIAL NOT NULL,
    "iban" CHAR(28) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "name" VARCHAR(50) NOT NULL DEFAULT 'Konto osobiste',
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_balance" DECIMAL(18,2) NOT NULL DEFAULT 0.0,
    "available_balance" DECIMAL(18,2) NOT NULL DEFAULT 0.0,
    "blocked_amount" DECIMAL(18,2) NOT NULL DEFAULT 0.0,
    "daily_transfer_limit" DECIMAL(18,2) NOT NULL DEFAULT 0.0,
    "closed_at" TIMESTAMP(3),
    "closed_reason" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "user_account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "role" "AccountRole" NOT NULL DEFAULT 'OWNER',

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("user_account_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "code" CHAR(30) NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT 'PENDING',
    "type" "TransactionType" NOT NULL DEFAULT 'INTERNAL_TRANSFER',
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "booking_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "cards" (
    "card_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL DEFAULT 'Moja Karta',
    "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE',
    "card_number_hash" VARCHAR(254) NOT NULL,
    "last_digits" CHAR(4) NOT NULL,
    "cvv_hash" VARCHAR(254) NOT NULL,
    "pin_hash" VARCHAR(254) NOT NULL,
    "expiry_month" INTEGER NOT NULL,
    "expiry_year" INTEGER NOT NULL,
    "payment_limit" DECIMAL(18,2) NOT NULL DEFAULT 5000.0,
    "withdraw_limit" DECIMAL(18,2) NOT NULL DEFAULT 5000.0,
    "daily_payment_limit" DECIMAL(18,2) NOT NULL DEFAULT 500.0,
    "daily_withdraw_limit" DECIMAL(18,2) NOT NULL DEFAULT 500.0,
    "blocked_at" TIMESTAMP(3),
    "blocked_reason" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
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

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
