const jwt = require('jsonwebtoken')


const checkAuth = (req, res, next)=>{
    const {authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {username, userId}= decoded
        req.username = username
        req.userId = userId
        next()
    }catch(err){
        console.log(err)
        next(`Auth failed!`)
    }
}

module.exports = checkAuth