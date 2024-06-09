import dotenv from  'dotenv'
import jwt from 'jsonwebtoken'
import token from '../models/token-schema.js'
dotenv.config()
export const loginUserController = async(request, response) => {
    
    try {
        
        if(request.body.username === process.env.USER && request.body.password === process.env.PASS){
            
            let user ={
                username:process.env.USER,
                password:process.env.PASS
            }
            
             const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {expiresIn :'200m' });
             const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY);
             
             const newToken = new token({token:refreshToken});
            
             await newToken.save();
             return response.status(200).json({status:'success',accessToken : accessToken, refreshToken : refreshToken });
        }else{
            
            return response.status(400).json({status:'failed',msg:'Error while authenticating '});
        }
    } catch (error) {
        console.log(error)
        return response.status(500).json({msg:'Error while login user'});
    }
}


export const authenticateToken = (request,response,next) =>{
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(token == null){
        return response.status(401).json(({ msg : 'token is missing'}))
    }

    jwt.verify(token , process.env.ACCESS_SECRET_KEY ,(error , user) => {
        if(error){
            return response.status(403).json({msg: 'invalid token'})
        }
        
        next();
    })

    

}