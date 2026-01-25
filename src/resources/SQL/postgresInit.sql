CREATE TABLE
    IF NOT EXISTS commands (
        id SERIAL PRIMARY KEY,
        isEmbed BOOLEAN NOT NULL,
        name TEXT NOT NULL,
        content TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL,
        responde TEXT NOT NULL,
        server TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS commands_alt (
        id SERIAL PRIMARY KEY,
        initiator VARCHAR(255) NOT NULL,
        textorjson BOOLEAN NOT NULL,
        command TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL,
        value TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS coremods (
        id SERIAL PRIMARY KEY,
        tagName TEXT,
        version TEXT,
        updatedat TEXT,
        url TEXT
    );

CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        globalname TEXT,
        avatar TEXT,
        discordid TEXT NOT NULL UNIQUE,
        theme TEXT NOT NULL DEFAULT 'default',
        style TEXT NOT NULL DEFAULT 'uppercase',
        description TEXT,
        githubusername TEXT,
        nexusmodsusername TEXT,
        nexusmods JSONB,
        github JSONB,
        roles JSONB
    );

CREATE TABLE
    IF NOT EXISTS quotesblock (
        id SERIAL PRIMARY KEY,
        channelname TEXT NOT NULL,
        channelid TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS wrapped (
        id SERIAL PRIMARY KEY,
        discordid TEXT NOT NULL,
        messagessend BIGINT NOT NULL,
        commandsused BIGINT NOT NULL,
        gifposted BIGINT NOT NULL,
        lastoffline timestamp NOT NULL,
        lastonline timestamp NOT NULL,
        onlinestreak BIGINT NOT NULL,
        avgreactions BIGINT NOT NULL
    );