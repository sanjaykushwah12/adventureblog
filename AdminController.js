class AdminController{
    
    static Dashboard=(req,res)=>{
       
        try{
            const{name,email}=req.admin
            res.render('admin/dashboard',{n:name})
        }catch(error){
            console.log(error)

        }
    }

}
module.exports=AdminController