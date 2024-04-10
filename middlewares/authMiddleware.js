const JWT = require('jsonwebtoken')

module.exports = async(req,res,next)=>{
try {
    const token = req.headers['authorization'].split(" ")[1]
JWT.verify(token,process.env.JWT_SECRET , (err , decode)=>{
    if(err){
        return res.status(200).send({
            message:'Auth Failed' ,
            success : false
        })
    }else{
        req.body.userId =  decode.id 
        //userId: This is a property being assigned on the body object. It seems to be intended to represent the ID of the user associated with the request.
        next()
    }
})
} catch (error) {
    console.log(error)
    res.status(401).send({
        message : 'Auth Failed' , 
        success:false
    }) 
}
}