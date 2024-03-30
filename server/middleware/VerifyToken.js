const jwt =require('jsonwebtoken')

const token_config = require('../../config/token');

/* jwt token verify */
const authenticationVerifier = (req, res, next)=> {

    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, token_config.token.jwt_secret,(err, user)=>{
            if(err) res.status(401).json("Invalid token");
            req.user = user;
            next()
        })
    } else {
        return res.status(401).json("You are not authenticated");
    }
}

// /* check if the current user */
// const accessLevelVerifier = (req, res, next) => {
//     authenticationVerifier(req,res, ()=>{
//         if(req.user.id === req.params.id || req.user.isAdmin) {
//             next()
//         } else {
//             res.status(403).json("You are not allowed to perform this task");
//         }
//     })
// }

// /* access_level_verifier('admin') */
// const isAdminVerifier = (req, res, next) => {
//     authenticationVerifier(req, res, ()=> {
//         if(req.user.isAdmin) {
//             next();
//         } else {
//             res.status(403).json("You are not allowed to perform this task")
//         }
//     })
// }

module.exports = { authenticationVerifier, accessLevelVerifier, isAdminVerifier };