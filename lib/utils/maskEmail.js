const maskEmail = (email) => {
  let maskedEmail = '';

  if (typeof email === 'string' && email.length > 1) {
    const emailSplit = email.split('@');
    const regex = emailSplit.length > 1 && emailSplit[0].length === 2
      ? /^(.)(.)(@.*)$/ // Mask the second character if the username only has 2 characters.
      : /^(.)(.*)(.@.*)$/; // Mask all characters between first and last if the username has > 2 characters.

    maskedEmail = email.replace(
      regex,
      (_, firstSection, toBeMasked, remainder) => `${firstSection}${toBeMasked.replace(/./g, '*')}${remainder}`,
    );
  }
  return maskedEmail;
};
module.exports = { maskEmail };
