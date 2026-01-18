-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Student', 'Alumni', 'Professor', 'Mentor', 'Investor', 'External', 'Admin');

-- CreateEnum
CREATE TYPE "IdeaCategory" AS ENUM ('Tech', 'Healthcare', 'Sustainability', 'SocialImpact', 'Education', 'Other');

-- CreateEnum
CREATE TYPE "IdeaStage" AS ENUM ('Idea', 'EarlyDevelopment', 'Prototype', 'SeekingFunding');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('Collaborate', 'Fund', 'Explore', 'Mentor');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('active', 'withdrawn');

-- CreateEnum
CREATE TYPE "FundingStatus" AS ENUM ('Open', 'InDiscussion', 'Closed', 'Funded');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('interest', 'funding', 'comment', 'collaboration', 'system');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "affiliation" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skills" TEXT[],
    "experience" JSONB,
    "social_links" JSONB,
    "preferences" JSONB,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "category" "IdeaCategory" NOT NULL,
    "stage" "IdeaStage" NOT NULL,
    "contact_email" TEXT,
    "status" "IdeaStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "open_opportunities" JSONB,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_tags" (
    "id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "idea_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interest_signals" (
    "id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interest_type" "InterestType" NOT NULL,
    "message" TEXT,
    "status" "InterestStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interest_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_opportunities" (
    "id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stage" TEXT,
    "status" "FundingStatus" NOT NULL,
    "terms" TEXT,
    "deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funding_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_investors" (
    "id" TEXT NOT NULL,
    "funding_opportunity_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "commitment_amount" DECIMAL(65,30),
    "status" TEXT NOT NULL DEFAULT 'interested',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funding_investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "ideas_category_idx" ON "ideas"("category");

-- CreateIndex
CREATE INDEX "ideas_stage_idx" ON "ideas"("stage");

-- CreateIndex
CREATE INDEX "ideas_status_idx" ON "ideas"("status");

-- CreateIndex
CREATE INDEX "ideas_user_id_idx" ON "ideas"("user_id");

-- CreateIndex
CREATE INDEX "idea_tags_idea_id_idx" ON "idea_tags"("idea_id");

-- CreateIndex
CREATE UNIQUE INDEX "idea_tags_idea_id_tag_key" ON "idea_tags"("idea_id", "tag");

-- CreateIndex
CREATE INDEX "interest_signals_idea_id_idx" ON "interest_signals"("idea_id");

-- CreateIndex
CREATE INDEX "interest_signals_user_id_idx" ON "interest_signals"("user_id");

-- CreateIndex
CREATE INDEX "interest_signals_interest_type_idx" ON "interest_signals"("interest_type");

-- CreateIndex
CREATE UNIQUE INDEX "interest_signals_idea_id_user_id_key" ON "interest_signals"("idea_id", "user_id");

-- CreateIndex
CREATE INDEX "funding_opportunities_idea_id_idx" ON "funding_opportunities"("idea_id");

-- CreateIndex
CREATE INDEX "funding_opportunities_status_idx" ON "funding_opportunities"("status");

-- CreateIndex
CREATE INDEX "funding_investors_funding_opportunity_id_idx" ON "funding_investors"("funding_opportunity_id");

-- CreateIndex
CREATE INDEX "funding_investors_user_id_idx" ON "funding_investors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "funding_investors_funding_opportunity_id_user_id_key" ON "funding_investors"("funding_opportunity_id", "user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_idx" ON "notifications"("user_id", "read");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_tags" ADD CONSTRAINT "idea_tags_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interest_signals" ADD CONSTRAINT "interest_signals_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interest_signals" ADD CONSTRAINT "interest_signals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_opportunities" ADD CONSTRAINT "funding_opportunities_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_investors" ADD CONSTRAINT "funding_investors_funding_opportunity_id_fkey" FOREIGN KEY ("funding_opportunity_id") REFERENCES "funding_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_investors" ADD CONSTRAINT "funding_investors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
