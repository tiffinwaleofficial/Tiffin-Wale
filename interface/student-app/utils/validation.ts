// Password validation rules
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[@$!%*?&]/,
};

export interface PasswordStrength {
  score: number;
  message: string;
}

export const validatePassword = (password: string): boolean => {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return false;
  }

  // Check for ALL 4 criteria to match backend validation
  const hasUppercase = PASSWORD_REGEX.uppercase.test(password);
  const hasLowercase = PASSWORD_REGEX.lowercase.test(password);
  const hasNumber = PASSWORD_REGEX.number.test(password);
  const hasSpecial = PASSWORD_REGEX.special.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, message: 'Enter a password' };
  }

  let score = 0;
  let message = '';

  // Length check
  if (password.length >= PASSWORD_MIN_LENGTH) {
    score++;
  }

  // Character type checks
  if (PASSWORD_REGEX.uppercase.test(password)) score++;
  if (PASSWORD_REGEX.lowercase.test(password)) score++;
  if (PASSWORD_REGEX.number.test(password)) score++;
  if (PASSWORD_REGEX.special.test(password)) score++;

  // Additional length bonus
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Cap the score at 4
  score = Math.min(score, 4);

  // Set message based on score
  switch (score) {
    case 0:
      message = 'Very weak';
      break;
    case 1:
      message = 'Weak';
      break;
    case 2:
      message = 'Fair';
      break;
    case 3:
      message = 'Strong';
      break;
    case 4:
      message = 'Very strong';
      break;
    default:
      message = 'Invalid';
  }

  return { score, message };
}; 