const formatPhoneNumber = (phoneNumber) => {
  const digitsOnly = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters

  if (digitsOnly.startsWith("0")) {
    // If the number starts with 0, replace it with 255
    return `255${digitsOnly.slice(1)}`;
  } else if (digitsOnly.startsWith("255")) {
    // If the number already starts with 255, return as is
    return digitsOnly;
  } else if (phoneNumber.startsWith("+255")) {
    // If the number starts with +255, remove the plus sign
    return phoneNumber.slice(1);
  } else {
    // Default case, assume it's a valid local number and prepend 255
    return `255${digitsOnly}`;
  }
};

module.exports = formatPhoneNumber;
