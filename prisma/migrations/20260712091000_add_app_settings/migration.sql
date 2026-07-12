-- CreateTable
CREATE TABLE "app_settings" (
    "id" UUID NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
    "depot_name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "distance_unit" TEXT NOT NULL DEFAULT 'kilometers',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_scope_key" ON "app_settings"("scope");
