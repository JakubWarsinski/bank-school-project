-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id_card_expiry" TIMESTAMP(3),
ADD COLUMN     "id_card_issue" TIMESTAMP(3),
ADD COLUMN     "id_card_number" VARCHAR(20),
ADD COLUMN     "main_income_sources" VARCHAR(200),
ADD COLUMN     "monthly_net_income" VARCHAR(50),
ADD COLUMN     "profession" VARCHAR(100);
