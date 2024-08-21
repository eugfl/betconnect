-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE INDEX "ResetPasswordToken_userId_idx" ON "ResetPasswordToken"("userId");

-- AddForeignKey
ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
