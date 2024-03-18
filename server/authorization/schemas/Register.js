module.exports = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    },
    phonenumber: {
      type: 'string',
    },
    password: {
      type: 'string'
    },
  },
  required: [
    'username',
    'phonenumber',
    'password',
  ],
  additionalProperties: false
};