CREATE TABLE
    IF NOT EXISTS "commands" (
        "id" INT AUTO_INCREMENT PRIMARY KEY,
        "initiator" VARCHAR(255) NOT NULL,
        "textorjson" BOOLEAN NOT NULL,
        "command" TEXT NOT NULL,
    )

CREATE TABLE
    IF NOT EXISTS "settings" (
        "id" INT AUTO_INCREMENT PRIMARY KEY,
        "key" VARCHAR(255) NOT NULL,
        "value" TEXT NOT NULL
    )
