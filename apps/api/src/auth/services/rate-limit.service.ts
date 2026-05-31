const key =
  `ratelimit:${policy}:${identifier}`;

const count =
  await redis.incr(key);

if (count === 1) {
  await redis.expire(
    key,
    policy.windowSeconds,
  );
}