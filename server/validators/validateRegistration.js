const validator = require('validator');

module.exports = function validateRegistration(data) {
  const errors = {};

  if (!data.name || !/^[A-Za-z\s]+$/.test(data.name)) {
    errors.name = 'Name is required and must contain only letters and spaces';
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.email = 'A valid email is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.age || isNaN(data.age)) {
    errors.age = 'Age must be a number';
  } else if (data.age < 13 || data.age > 120) {
    errors.age = 'Age must be between 13 and 120';
  }

  if (data.gender && !['Male', 'Female', 'Prefer not to say'].includes(data.gender)) {
    errors.gender = 'Gender selection is invalid';
  }

  // Optional fields: sanitize if they exist
  const optionalTextFields = ['occupation', 'location', 'churchName', 'churchRole', 'interests', 'bio', 'prayerRequest'];
  for (const field of optionalTextFields) {
    if (data[field] && typeof data[field] !== 'string') {
      errors[field] = `${field} must be a string`;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};