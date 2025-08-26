const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY;
async function isAuthMiddleware(req,res,next){
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({login : false})
    }
    try {
        const decoded = jwt.verify(token,secretKey);
        req.user = decoded;
        next()
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({login  : false})
    }
}

async function isAdminMiddleware(req,res,next){
    if(req.user.role!=='admin'){
        return res.status(403).json({message : "Access denied admin only"})
    }
    next();
}


module.exports={
    isAuthMiddleware,
    isAdminMiddleware
}