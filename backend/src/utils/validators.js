// backend/src/utils/validators.js

// Regex constants for named imports
export const nameRegex = /^[A-Za-z\s]{3,50}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validation functions
export const validateEmail = (email) => emailRegex.test(email);

export const validatePassword = (password) => passwordRegex.test(password);

export const validateName = (name) => typeof name === "string" && nameRegex.test(name);

export const validateItem = (item) => {
  return (
    item &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    item.expiryDate &&
    !isNaN(new Date(item.expiryDate))
  );
};
