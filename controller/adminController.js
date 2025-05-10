const user = require("../model/registerSchema");

exports.renderDashboard = (req,res)=>{
    res.render('adminDashboard');
}
exports.renderUsers = async (req,res)=>{
    const userData = await user.find();
    res.render('users',{userData});
}
exports.deleteUser = async(req,res)=>{
    try {
    const validUser = await user.findByIdAndDelete(req.params.id);
    if(!validUser){
        req.flash('error','user doesnot exists');
        return res.render('users',{flashMessage:req.flash('error')});
    }
        const userData = await user.find();
    req.flash('success','user deleted');
    return res.render('users',{flashMessage:req.flash('success'),userData});
    } catch (error) {
        console.log('error in deleting user');
    }
}
exports.renderUserData = async(req,res)=>{
    const id = req.params.id;
    const userData = await user.findOne({_id:id});
    if(!userData){
        req.flash('error','user doesnt exists');
    }
    res.render('adminEditUser',{userData});
}
exports.editUserData = async(req,res)=>{
        const id = req.params.id;
        const {name} = req.body;
    const success = await user.findByIdAndUpdate({_id:id},{name});
    if(!success){
        req.flash('error','user doesnot exists');
    }
    req.flash('success','user data updated');
     const userData = await user.find();
    return res.render('users',{flashMessage:req.flash('success'),userData});
}