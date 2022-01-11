import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { TWENTY_FOUR_HOURS } from "../../constants";

@Injectable()
export class RedisService {
  private redis = new Redis({
    host: "redis",
  });

  async invalidateToken(token: string) {
    await this.redis.set(token, "INVALID", "EX", TWENTY_FOUR_HOURS);
  }

  async isTokenValid(token: string): Promise<boolean> {
    return (await this.redis.exists(token)) === 0;
  }
}
