import jwt from 'jsonwebtoken';

export const auth = (req,res,next) =>{
    const authHeader = req.header('Authorization');
    console.log("AUTH HEADER:", req.header("Authorization"));

    if(!authHeader){
        return res.status(401).json({msg:"No token provided"});

    }
    
    const [type, token] = authHeader.split(" ");

    if(type !== 'Bearer' || !token){
        return res.status(401).json({msg:'Invalid token format'});

    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        console.log("DECODED USER:", decoded);

        req.user = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({msg:'Token invalid or expired'})
    }



};
