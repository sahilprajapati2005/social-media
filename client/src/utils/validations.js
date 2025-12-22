
// Email Validation Regex
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password Strength Checker
// Min 6 chars, at least one letter and one number
export const isStrongPassword = (password) => {
  const minLength = 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return password.length >= minLength && hasLetter && hasNumber;
};

// Username Validation
// Alphanumeric, underscores, 3-20 chars
export const isValidUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

// Image File Validation (Size & Type)
export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };

  // Check Type (JPEG, PNG, WEBP)
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WEBP images are allowed.' };
  }

  // Check Size (Max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB.' };
  }

  return { valid: true, error: null };
};