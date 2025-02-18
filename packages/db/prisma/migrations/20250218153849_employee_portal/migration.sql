-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "linkId" TEXT;

-- CreateTable
CREATE TABLE "portal_user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "portal_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "portal_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_user_email_key" ON "portal_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "portal_session_token_key" ON "portal_session"("token");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "portal_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_session" ADD CONSTRAINT "portal_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "portal_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_account" ADD CONSTRAINT "portal_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "portal_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
