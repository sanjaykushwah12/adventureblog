const AboutModel = require('../../Model/about')

class AboutController{
    static about =async(req,res)=>{
        const data = await AboutModel.find()
        //console.log(data)
        res.render('admin/about/aboutdisplay',{ab:data})

    }
    static aboutedit =async(req,res)=>{
        // console.log(req.params.id)

        try{
            const result = await AboutModel.findById(req.params.id)
            // console.log(result)
            res.render('admin/about/aboutedit' ,{ae:result})
        }catch(err){
            console.log(err)
        }
    }

    static aboutupdate =async(req,res)=>{
        try{
            const result = await AboutModel.findByIdAndUpdate(req.params.id, {
                
                description:req.body.description,
               

            })
           await result.save()
            res.redirect('/admin/aboutdisplay')
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = AboutController