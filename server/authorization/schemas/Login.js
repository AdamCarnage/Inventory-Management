module.exports = {
    type: 'object',
    properties: {
      phonenumber: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: [
      'phonenumber',
      'password'
    ],
    additionalProperties: false
  };