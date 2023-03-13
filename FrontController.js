const BlogModel = require('../Model/Blog')
const ContactModel = require('../Model/fcontact')
const AboutModel= require('../Model/about')
const AdminModel = require('../Model/radmin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

 
class FrontController{
    static home =async(req,res)=>{
       
        const data = await BlogModel.find().sort( {_id:-1}).limit(6)
       // console.log(data)

        // res.send(" Hello Home page")
        res.render('home',{d:data})
    }
    static about =async(req,res)=>{
        const data = await AboutModel.find()
        // console.log(data)
        // res.send(" Hello about page")
        res.render('about',{fa:data})
       
    }
    static contact =(req,res)=>{
        
        // res.send(" Hello team members")
        res.render('contact')
    }

    static blog =async(req,res)=>{
       
        const data = await BlogModel.find().sort({_id:-1})
        res.render('blog',{bg:data})
    }
 

    static blogdetail =async(req,res)=>{
        try{
            const recentblog = await BlogModel.find()
            const result =await BlogModel.findById(req.params.id)
           // console.log(result)
            res.render('blogdetail',{bd:result,rb:recentblog})
        }catch(err){
            console.log(err)
        }
    }
    
    static contactinsert =async(req,res)=>{
        // const fcontact =await ContactModel.find()
        // console.log(req.body)
        try{
            const result = ContactModel({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                message:req.body.message
            })
           await result.save()
           res.render('contact')

        }catch(err){
            console.log(err)
        }
    }
// admin login
    static login =(req,res)=>{
        res.render('login',{message:req.flash('success'),msg:req.flash('error')})
    }

    static adminregister =(req,res)=>{
        res.render('register',{message: req.flash('error')})
    }

    static admininsert =async(req,res)=>{
        // console.log(req.body)
        try{
          const{name,email,password,cpassword}=req.body
          const admin = await AdminModel.findOne({email:email})
         //   console.log(admin)
          if(admin){
              req.flash('error','Email already exist ')
              res.redirect('/register')
            }
           else{
              if( name && email && password && cpassword){
                   
                  if(password==cpassword){
                    
                    try{
                         const hashpassword = await bcrypt.hash(password,10)
                         const result =await AdminModel({
                         name:name,
                         email:email,
                         password:hashpassword
                        })
                       await result.save()
                       req.flash('success','*Register Successfully Please Login*')
                       res.redirect('/login')


                    }catch(err){
                      console.log(err)
                    }

                  }
                  else{
                    req.flash('error','Password And Confirm Password doesnot Match ?')
                    res.redirect('/register')
                  }
                }
                else{
                  req.flash('error','All Field are required ')
                  res.redirect('/register')
                }
             
            }
        }catch(err){
            console.log(err)
            }
   
    }
    static verify = async(req,res)=>{
        try{
        //    console.log(req.body)
          const {email,password}=req.body
          if(email && password){
            const admin = await AdminModel.findOne({email:email})
            if(admin != null){
                const ismatched = await bcrypt.compare(password,admin.password)
                if(ismatched){
                    // token generate
                    const token = jwt.sign({id:admin._id }, 'sanjaykushwah202006');
                   // console.log(token)
                      res.cookie('token',token)
                      res.redirect('/admin/dashboard')

                }else{
                    req.flash('error','Email and Password are Invalid ')
                    res.redirect('/login')
                }

            }else{
                req.flash('error','You are not Registered ')
                res.redirect('/login')

            }

          }else{
            req.flash('error','All Field are required ')
            res.redirect('/login')
          }
        }catch(err){
            console.log(err)
        }
    }

    static logout = async(req,res)=>{
        try{
            res.clearCookie('token')
            res.redirect('/login')

        }catch(err){
            console.log(err)

        }
    }



}
module.exports = FrontController



        
// token = id +secret key
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzc5MjU2ZjlhOWMyMDJkYTFkYzc2MyIsImlhdCI6MTY3NDAyNzg1Mn0.GK2dAPo2ikzEiz2lCDyvC7yAUKs1lzkWEiCcHJgUBU8
