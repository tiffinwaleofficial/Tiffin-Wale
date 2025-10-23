export const passwordResetConfig = {
  // Rate limiting
  maxAttemptsPerHour: 9,
  rateLimitWindowMs: 60 * 60 * 1000, // 1 hour in milliseconds

  // Token configuration
  tokenExpiryMs: 60 * 60 * 1000, // 1 hour in milliseconds
  tokenLength: 32, // bytes (will be 64 chars in hex)

  // Security
  minPasswordLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,

  // Email masking
  maskEmail: (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.length > 3
        ? `${username.slice(0, 2)}***${username.slice(-1)}`
        : "***";
    return `${maskedUsername}@${domain}`;
  },
};
