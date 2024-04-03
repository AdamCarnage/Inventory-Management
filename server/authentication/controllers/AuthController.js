const User = require('../../users/models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const token_config = require('../../config/token');

const generateAccessToken = (phonenumber, userId) => {
    return jwt.sign(
      {
        userId,
        phonenumber,
      },
      token_config.token.jwt_secret,
      {
        expiresIn: "1d",
      }
    );
  };

  const encryptPassword = (password) => {
    // We will hash the password using SHA256 Algorithm before storing in the DB
    // Creating SHA-256 hash object
    const hash = crypto.createHash("sha256");
    // Update the hash object with the string to be encrypted
    hash.update(password);
    // Get the encrypted value in hexadecimal format
    return hash.digest("hex");
  };
  
  

const AuthController = {

        /* create new user */
        async create_user(req, res, next) {

            const newUser = new User({
                username: req.body.username,
                phonenumber: req.body.phonenumber,
                email: req.body.email,
                password: encryptPassword(req.body.password)
            });

            try {
                const user = await newUser.save();
                const accessToken = generateAccessToken(user.phonenumber, user._id);
                res.status(201).json({
                    type : 'success',
                    message: "User has been created successfuly",
                    user,
                    accessToken
                })
            } catch (err) {
                res.status(500).json({
                    type: "error",
                    message: "Something went wrong please try again",
                    err
                })
            }
        },

        async login_user(req, res) {
        
            const user = await User.findOne({ phonenumber: req.body.phonenumber });
            const encryptpassword = encryptPassword( req.body.password);
    
            if (!user || user.password!== encryptpassword) {
                res.status(404).json({
                    type: "error",
                    message: "User not exists or invalid credentials",
                })
            } else {
    
                const accessToken = generateAccessToken(user.phonenumber, user._id);
    
                const { password, ...data } = user._doc;
    
                res.status(200).json({
                    type: "success",
                    message: "Successfully logged",
                    ...data,
                    accessToken
                })
            }
        }
};

module.exports = AuthController;