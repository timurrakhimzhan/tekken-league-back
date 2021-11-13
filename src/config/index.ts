export const DATABASE_CONFIG = {
  HOST: process.env["DB_HOST"],
  PORT: process.env["DB_PORT"],
  NAME: process.env["DB_NAME"],
  USER: process.env["DB_USER"],
  PASSWORD: process.env["DB_PASSWORD"],
};

export const HASH_SALT = process.env["HASH_SALT"] || "default_salt";
export const JWT_SECRET = process.env["JWT_SECRET"] || "default_secret";
