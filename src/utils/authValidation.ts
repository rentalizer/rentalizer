// Common password patterns that are too weak
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', 'dragon', 'master', 'hello', 'freedom', 'whatever',
  'qazwsx', 'trustno1', '654321', 'jordan23', 'harley', 'password1',
  'jordan', 'jennifer', 'zxcvbnm', 'asdfgh', '123123', '1234567',
  '12345678', '1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  '1q2w3e4r', '1qaz2wsx', 'qazwsxedc', 'qwerty1234', 'password12'
];

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Name validation regex (allows letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface SignupValidationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: "Email is required" };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: "Email address is too long" };
  }
  
  return { isValid: true, message: "" };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Password is too long (maximum 128 characters)" };
  }
  
  // Check for required character types (matching backend validation)
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLowerCase || !hasUpperCase || !hasNumber) {
    const missing = [];
    if (!hasLowerCase) missing.push("lowercase letter");
    if (!hasUpperCase) missing.push("uppercase letter");
    if (!hasNumber) missing.push("number");
    
    return { 
      isValid: false, 
      message: `Password must contain at least one ${missing.join(", one ")}` 
    };
  }
  
  // Check for common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return { isValid: false, message: "This password is too common. Please choose a more secure password" };
  }
  
  // Check for very weak passwords (all same character)
  if (/^(.)\1+$/.test(password)) {
    return { isValid: false, message: "Password cannot be all the same character" };
  }
  
  // Check for sequential patterns
  if (/123456|abcdef|qwerty/i.test(password)) {
    return { isValid: false, message: "Password contains common patterns. Please choose a more secure password" };
  }
  
  return { isValid: true, message: "" };
};

export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: `${fieldName} is too long (maximum 50 characters)` };
  }
  
  if (!NAME_REGEX.test(name.trim())) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true, message: "" };
};

export const validateBio = (bio: string): ValidationResult => {
  if (!bio || !bio.trim()) {
    return { isValid: true, message: "" }; // Bio is optional
  }
  
  if (bio.trim().length > 500) {
    return { isValid: false, message: "Bio is too long (maximum 500 characters)" };
  }
  
  return { isValid: true, message: "" };
};

export const validateProfilePicture = (profilePicture: string): ValidationResult => {
  if (!profilePicture) {
    return { isValid: true, message: "" }; // Profile picture is optional
  }
  
  // Check if it's a valid base64 data URL
  if (!profilePicture.startsWith('data:image/')) {
    return { isValid: false, message: "Invalid image format" };
  }
  
  // Check file size (base64 is about 33% larger than binary)
  const sizeInBytes = (profilePicture.length * 3) / 4;
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  
  if (sizeInBytes > maxSizeInBytes) {
    return { isValid: false, message: "Image is too large (maximum 2MB)" };
  }
  
  // Check for valid image types
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const imageType = profilePicture.split(';')[0].split(':')[1];
  
  if (!validTypes.includes(imageType)) {
    return { isValid: false, message: "Unsupported image format. Please use JPEG, PNG, GIF, or WebP" };
  }
  
  return { isValid: true, message: "" };
};

export const validateSignupData = (data: SignupValidationData): ValidationResult => {
  const errors: string[] = [];
  
  // Check for required fields first
  if (!data.email || !data.email.trim()) {
    errors.push(`Email: Email is required`);
  }
  if (!data.password || !data.password.trim()) {
    errors.push(`Password: Password is required`);
  }
  if (!data.firstName || !data.firstName.trim()) {
    errors.push(`First Name: First name is required`);
  }
  if (!data.lastName || !data.lastName.trim()) {
    errors.push(`Last Name: Last name is required`);
  }
  
  // If required fields are missing, return early
  if (errors.length > 0) {
    return { 
      isValid: false, 
      message: errors.length === 1 ? errors[0] : `Please fix the following issues:\n• ${errors.join('\n• ')}`
    };
  }
  
  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push(`Email: ${emailValidation.message}`);
  }
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(`Password: ${passwordValidation.message}`);
  }
  
  // Validate first name
  const firstNameValidation = validateName(data.firstName, "First name");
  if (!firstNameValidation.isValid) {
    errors.push(`First Name: ${firstNameValidation.message}`);
  }
  
  // Validate last name
  const lastNameValidation = validateName(data.lastName, "Last name");
  if (!lastNameValidation.isValid) {
    errors.push(`Last Name: ${lastNameValidation.message}`);
  }
  
  // Validate bio (optional)
  const bioValidation = validateBio(data.bio || '');
  if (!bioValidation.isValid) {
    errors.push(`Bio: ${bioValidation.message}`);
  }
  
  // Validate profile picture (optional)
  const profilePictureValidation = validateProfilePicture(data.profilePicture || '');
  if (!profilePictureValidation.isValid) {
    errors.push(`Profile Picture: ${profilePictureValidation.message}`);
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      message: errors.length === 1 ? errors[0] : `Please fix the following issues:\n• ${errors.join('\n• ')}`
    };
  }
  
  return { isValid: true, message: "" };
};

export const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong'; message: string } => {
  if (password.length < 6) {
    return { strength: 'weak', message: 'Too short' };
  }
  
  let score = 0;
  
  // Required character types
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  
  // Check if password meets minimum requirements
  if (!hasLowerCase || !hasUpperCase || !hasNumber) {
    const missing = [];
    if (!hasLowerCase) missing.push("lowercase");
    if (!hasUpperCase) missing.push("uppercase");
    if (!hasNumber) missing.push("number");
    return { strength: 'weak', message: `Missing ${missing.join(", ")}` };
  }
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (hasLowerCase) score++;
  if (hasUpperCase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;
  
  // Common password check
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return { strength: 'weak', message: 'Common password' };
  }
  
  if (score < 4) {
    return { strength: 'weak', message: 'Weak password' };
  } else if (score < 6) {
    return { strength: 'medium', message: 'Medium strength' };
  } else {
    return { strength: 'strong', message: 'Strong password' };
  }
};
