import path from "path";
import Postgrator from "postgrator";
import { DATABASE_CONFIG } from "../config";

const migrationDirectory = path.resolve("./", "src", "db", "migrations");

const postgrator = new Postgrator({
  migrationDirectory,
  driver: "pg",
  database: DATABASE_CONFIG.NAME,
  host: DATABASE_CONFIG.HOST,
  port: DATABASE_CONFIG.PORT,
  username: DATABASE_CONFIG.USER,
  password: DATABASE_CONFIG.PASSWORD,
});

export async function migrate() {
  console.log("migrations started");
  return postgrator.migrate().then(() => {
    console.log("migrations applied");
  });
}
