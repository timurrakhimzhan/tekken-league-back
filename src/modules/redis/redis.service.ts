import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private redis = new Redis({
    host: "redis",
  });

  async invalidateToken(token: string) {
    await this.redis.set(token, "INVALID", "EX", 24 * 60 * 60);
  }

  async isTokenValid(token: string): Promise<boolean> {
    return (await this.redis.exists(token)) === 0;
  }
}
