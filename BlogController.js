const cloudinary = require('cloudinary').v2;
const { findById } = require('../../Model/Blog')
const BlogModel=require('../../Model/Blog')

cloudinary.config({ 
    cloud_name: 'dhcoov5km', 
    api_key: '489687497922462', 
    api_secret: 'h1wxDJXjO9VhHI5jn_7Af1c7_Gc',
   
  });




class BlogController{
    // static blogdisplay =(req,res)=>{
    //     res.render('admin/blog/blogdisplay')

    // }

    // use mongoose 
    static blogdisplay =async(req,res)=>{
        
        const data =await BlogModel.find().sort({_id:-1})
       // console.log(data)
        res.render('admin/blog/blogdisplay',{d:data})

    }

    
    static bloginsert1 =async(req,res)=>{
    //     console.log('gwalior')
    //     console.log(req.body)
        //   console.log(req.files.image)
          const file = req.files.image

        //   console.log(file)
          const image_upload= await cloudinary.uploader.upload(file.tempFilePath,{
            folder:'blogimg',
            width:400,
          })
        //   console.log(image_upload)
     try{
        const result = BlogModel({
            title:req.body.title,
            description:req.body.description,
            image:
            {   public_id: image_upload.public_id,
                url:image_upload.secure_url 

            }
        })
        await result.save()
       // route url(app.js) in redirect
        res.redirect('/admin/blogdisplay')

     }catch(err){
        console.log(err)
     }
   
   
    }

    static blogview =async(req,res)=>{
        // console.log(req.params.id)     // id get by params
    try{
        const result = await BlogModel.findById(req.params.id)
        // console.log(result)
        res.render('admin/blog/blogview', {b:result})
    }catch(err){
        console.log(err)
    }

    }

    static blogedit = async(req,res)=>{
        // console.log(req.params.id)

        try{
            const result = await BlogModel.findById(req.params.id)
            // console.log(result)
            res.render('admin/blog/blogedit', {b:result})
        }catch(err){
            console.log(err)
        }
    }
    static blogupdate = async(req,res)=>{
        //    console.log(req.params.id)
        //    console.log(req.body)
     // image delete code
        const blogdata = await BlogModel.findById(req.params.id)
       // console.log(blogdata)  
        const imageid = blogdata.image.public_id
        //console.log(imageid)     
        await cloudinary.uploader.destroy(imageid)


        // image update code
          const file = req.files.image
          const image_upload= await cloudinary.uploader.upload(file.tempFilePath,{
            folder:'blogimg',
            width:400,
          })
         try{
            const result = await BlogModel.findByIdAndUpdate(req.params.id, {
                title:req.body.title,
                description:req.body.description,
                image:
                {   public_id: image_upload.public_id,
                    url:image_upload.secure_url 
    
                }


            })
           await result.save()
            res.redirect('/admin/blogdisplay')


         }catch(err){
            console.log(err)
        }

    }
   static blogdelete =async(req,res)=>{
    //    console.log(req.params.id)
       try{

          // image delete code
        const blogdata = await BlogModel.findById(req.params.id)
        // console.log(blogdata)  
         const imageid = blogdata.image
         //console.log(imageid)     
         await cloudinary.uploader.destroy(imageid)

         const result= await BlogModel.findByIdAndDelete(req.params.id)
         res.redirect('/admin/blogdisplay')
       }catch(err){
        console.log(err)
       }
   }
}
module.exports=BlogController