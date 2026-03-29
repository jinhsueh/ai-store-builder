import { nanoid } from 'nanoid';

let redisClient: import('ioredis').default | null = null;

async function getRedis() {
  if (redisClient) return redisClient;
  if (!process.env.REDIS_URL) return null;
  const Redis = (await import('ioredis')).default;
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    connectTimeout: 5000,
  });
  return redisClient;
}

const MAGIC_LINK_TTL = 60 * 15; // 15 minutes
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

export async function createMagicToken(email: string): Promise<string> {
  const redis = await getRedis();
  const token = nanoid(32);
  if (redis) {
    await redis.set(`magic:${token}`, email, 'EX', MAGIC_LINK_TTL);
  }
  return token;
}

export async function verifyMagicToken(token: string): Promise<string | null> {
  const redis = await getRedis();
  if (!redis) return null;
  const email = await redis.get(`magic:${token}`);
  if (!email) return null;
  // Delete token after use (one-time)
  await redis.del(`magic:${token}`);
  return email;
}

export async function createSession(email: string): Promise<string> {
  const redis = await getRedis();
  const sessionId = nanoid(32);
  if (redis) {
    await redis.set(`session:${sessionId}`, email, 'EX', SESSION_TTL);
  }
  return sessionId;
}

export async function getSession(sessionId: string): Promise<string | null> {
  const redis = await getRedis();
  if (!redis) return null;
  return redis.get(`session:${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    await redis.del(`session:${sessionId}`);
  }
}
