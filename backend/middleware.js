const jwt = require("jsonwebtoken")

function authmiddleware(req,res,next){
    const token =req.headers.token
    const decoded = jwt.verify(token,"123random")

    const username = decoded.username
    const email = decoded.email

    if(!username && !email){
        res.json({message:"Invalid token"})
    }
    else{
        req.username = username,
        req.email = email
        next()
    }
}

module.exports = {
    authmiddleware
}

