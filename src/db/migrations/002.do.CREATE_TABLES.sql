CREATE TABLE IF NOT EXISTS d_characters(
    codename VARCHAR(50) NOT NULL,
    label_ru VARCHAR(50) NOT NULL,
    label_en varchar(50) NOT NULL,
    PRIMARY KEY (codename)
);


CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    "character" VARCHAR(50) NOT NULL,
    steam_url VARCHAR(150) NOT NULL,
    other_info TEXT,
    email_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,

    failed_login_attempts INTEGER DEFAULT 0,
    failed_login_time TIMESTAMP,
    forgot_password_time TIMESTAMP,

    PRIMARY KEY (username),
    CONSTRAINT FK_USERS_CHARACTER FOREIGN KEY ( "character" ) REFERENCES d_characters(codename)
);


CREATE TABLE IF NOT EXISTS seasons(
    id SERIAL,
    label VARCHAR(50) NOT NULL,
    started_at TIMESTAMP DEFAULT NOW() NOT NULL,
    finished_at TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users_seasons(
    id SERIAL,
    username VARCHAR(50) NOT NULL,
    season_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    wins INTEGER DEFAULT 0 NOT NULL,
    loses INTEGER DEFAULT 0 NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT FK_USERS_SEASONS_USERNAME FOREIGN KEY ( username ) REFERENCES users(username),
    CONSTRAINT FK_USERS_SEASONS_SEASON_ID FOREIGN KEY ( season_id ) REFERENCES seasons(id)
);

CREATE TYPE match_status AS ENUM (
    'CONFIRMING_MATCH',
    'DECLINED',
    'IN_PROGRESS',
    'CONFIRMING_SCORE',
    'FINISHED'
);

CREATE TYPE player_type AS ENUM (
    'CHALLENGER',
    'CHALLENGED'
);

CREATE TABLE IF NOT EXISTS matches(
    id SERIAL,
    challenger_username VARCHAR(50) NOT NULL,
    challenger_score INTEGER,
    challenged_username VARCHAR(50) NOT NULL,
    challenged_score INTEGER,
    status match_status NOT NULL,
    submitted_by player_type,
    winner player_type,
    winner_delta INTEGER,
    first_to INTEGER NOT NULL,

    challenger_comment TEXT,
    declined_comment TEXT,

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    result_submitted_at TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT FK_MATCHES_CHALLENGER_USERNAME FOREIGN KEY ( challenger_username ) REFERENCES users(username),
    CONSTRAINT FK_MATCHES_CHALLENGED_USERNAME FOREIGN KEY ( challenged_username ) REFERENCES users(username),
    CONSTRAINT POSITIVE_WINNER_DELTA CHECK (winner_delta > 0 OR winner_delta IS NULL)
);




