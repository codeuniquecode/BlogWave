exports.home = (req,res)=>{
    res.render('home');
    return res.status(200).json({message: "home page here" });
}
exports.registerUser = async (req,res)=>{
    // name,email,passowrd
    
}
exports.loginUser = async (req,res)=>{

}