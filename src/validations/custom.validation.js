const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 4) {
    return helpers.message('Pin must be 4 digits');
  }
  if (!value.match(/\d/) || !value.match(/[0-9]{4}$/)) {
    return helpers.message('Pin must have 4 digit numbers');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
