/**
 * Gets a random character from the given character set.
 *
 * @param {string} charSet - The character set from which to select a random character.
 * @returns {string} A random character from the given character set.
 */
function getRandomChar(charSet: string): string {
  // Generate a random index within the length of the character set
  const randomIndex = Math.floor(Math.random() * charSet.length);
  // Return the character at the random index
  return charSet.charAt(randomIndex);
}

/**
 * Generates a random password of specified length.
 *
 * @param {number} [length=12] - The length of the password. Default is 12.
 * @returns {string} The generated random password.
 */
export function generateRandomPassword(length = 12): string {
  // Define character sets for different types of characters
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Initialize password string
  let password = "";

  // Ensure at least one character from each category
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  // Generate the remaining characters
  for (let i = password.length; i < length; i++) {
    const charSet = uppercaseChars + lowercaseChars + numberChars + specialChars;
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet.charAt(randomIndex);
  }

  // Shuffle the characters to make the order random
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}
