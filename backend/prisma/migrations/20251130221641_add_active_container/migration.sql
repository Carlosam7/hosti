-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deploy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastAccess" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Deploy" ("createdAt", "description", "id", "lastAccess", "repoUrl", "subdomain", "userId") SELECT "createdAt", "description", "id", "lastAccess", "repoUrl", "subdomain", "userId" FROM "Deploy";
DROP TABLE "Deploy";
ALTER TABLE "new_Deploy" RENAME TO "Deploy";
CREATE UNIQUE INDEX "Deploy_subdomain_key" ON "Deploy"("subdomain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
