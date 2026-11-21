-- Failed sign-in counter shared across server instances (login lockout).
CREATE TABLE "LoginAttempt" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "firstAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedUntil" DATETIME
);
