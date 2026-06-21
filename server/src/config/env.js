function requiredEnv(name, devFallback = null) {
  const value = process.env[name];

  if (value) return value;

  if (process.env.NODE_ENV !== "production" && devFallback) {
    return devFallback;
  }

  throw new Error(`Missing required environment variable: ${name}`);
}

module.exports = { requiredEnv };
