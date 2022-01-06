CREATE TABLE IF NOT EXISTS "DCharacter"(
    "codename" VARCHAR(50) NOT NULL,
    "labelRu" VARCHAR(50) NOT NULL,
    "labelEn" varchar(50) NOT NULL,
    PRIMARY KEY ("codename")
);


CREATE TABLE IF NOT EXISTS "User"(
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "character" VARCHAR(50) NOT NULL,
    "steamUrl" VARCHAR(150) NOT NULL,
    "otherInfo" TEXT,
    "emailConfirmed" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,

    PRIMARY KEY ("username"),
    CONSTRAINT FK_USERS_CHARACTER FOREIGN KEY ( "character" ) REFERENCES "DCharacter"("codename")
);


CREATE TABLE IF NOT EXISTS "Season"(
    "id" SERIAL,
    "label" VARCHAR(50) NOT NULL,
    "startedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "finishedAt" TIMESTAMP,
    "isCurrent" BOOLEAN DEFAULT TRUE NOT NULL,

    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "UserSeason"(
    "id" SERIAL,
    "username" VARCHAR(50) NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "wins" INTEGER DEFAULT 0 NOT NULL,
    "loses" INTEGER DEFAULT 0 NOT NULL,

    PRIMARY KEY ("id"),
    CONSTRAINT FK_USERS_SEASONS_USERNAME FOREIGN KEY ( "username" ) REFERENCES "User"("username"),
    CONSTRAINT FK_USERS_SEASONS_SEASON_ID FOREIGN KEY ( "seasonId" ) REFERENCES "Season"("id")
);

CREATE TYPE "MatchStatus" AS ENUM (
    'IN_PROGRESS',
    'CONFIRMING_SCORE',
    'DECLINED',
    'FINISHED'
);

CREATE TYPE "ChallengeStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);

CREATE TABLE IF NOT EXISTS "Challenge"(
    "id" SERIAL,
    "challengerUsername" VARCHAR(50) NOT NULL,
    "challengedUsername" VARCHAR(50) NOT NULL,
    "status" "ChallengeStatus" NOT NULL,
    "firstTo" INTEGER NOT NULL,

    "challengeComment" TEXT,
    "answerComment" TEXT,

    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "statusChangedAt" TIMESTAMP,

    PRIMARY KEY ("id"),
    CONSTRAINT FK_MATCHES_CHALLENGER_USERNAME FOREIGN KEY ( "challengerUsername" ) REFERENCES "User"(username),
    CONSTRAINT FK_MATCHES_CHALLENGED_USERNAME FOREIGN KEY ( "challengedUsername" ) REFERENCES "User"(username)
);

CREATE TABLE IF NOT EXISTS "Match"(
    "id" SERIAL,
    "p1Username" VARCHAR(50) NOT NULL,
    "p1Score" INTEGER,
    "p2Username" VARCHAR(50) NOT NULL,
    "p2Score" INTEGER,
    "status" "MatchStatus" NOT NULL,
    "submittedBy" VARCHAR(50),
    "p1Delta" INTEGER,
    "p2Delta" INTEGER,

    "declinedBy" VARCHAR(50),
    "declineComment" TEXT,

    "challengeId" INTEGER NOT NULL,

    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "resultSubmittedAt" TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT FK_P1_USERNAME FOREIGN KEY ( "p1Username" ) REFERENCES "User"("username"),
    CONSTRAINT FK_P2_USERNAME FOREIGN KEY ( "p2Username" ) REFERENCES "User"("username"),
    CONSTRAINT FK_DECLINED_BY_USERNAME FOREIGN KEY ( "declinedBy" ) REFERENCES "User"("username"),
    CONSTRAINT FK_SUBMITTED_BY_USERNAME FOREIGN KEY ( "submittedBy" ) REFERENCES "User"("username"),
    CONSTRAINT FK_CHALLENGE FOREIGN KEY ( "challengeId" ) REFERENCES "Challenge"("id")
);




