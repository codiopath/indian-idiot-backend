const express = require('express');
const app = express()
const mongoose = require('mongoose');
const HeroSectionModel = require('./Models/HeroSectionModel');
const AdminModel = require('./Models/AdminModel');
const AskIdiotModel = require('./Models/AskIdiotModel');
const AskIdiotAnswerModel = require('./Models/AskIdiotAnswerModel');
const JoinUsModel = require('./Models/JoinUsModel');
const cors = require('cors')

var bcrypt = require('bcryptjs');
const ContactModel = require('./Models/ContactModel');
const SectionModel = require('./Models/SectionModel');
var salt = bcrypt.genSaltSync(10);


app.use(express.json())
app.use(cors())


// -- coonect to Mongo DB ----

// mongoose.connect('mongodb+srv://Heaven:heaven@cluster0.rmoirps.mongodb.net/indianIdiot?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://indian:indian12345.@theindianidiot.vyvmo8z.mongodb.net/indianIdiot?retryWrites=true&w=majority')
.then(()=>{
    console.log('Connection with db established successfully')
})
.catch((err)=>{
    console.log("error :", err)
})

// ------ XXXXXX --------




app.get('/ping', (req, res)=>{
    res.send('pong')
})


// ----- For Adding Admin -------

app.post('/admin/add', async (req, res)=>{
    console.log('/admin/add Hitted')
    try{
        console.log(req.body)
    const {firstName, lastName, email, password, superAdmin, createdBy, adminId} = req.body
    const admin = await AdminModel.findById({_id: adminId})
    console.log(admin)
    if(admin && admin.superAdmin){
        const isExist = await AdminModel.findOne({email})
            if(isExist){
                res.send({myType: 'Error' , message:"Admin account already exists", data: admin})
              }
            
            else{
                const pass = await bcrypt.hashSync(password , salt);
                AdminModel.create({firstName, lastName, email, password: pass, superAdmin, createdBy})
                res.send({myType: 'Success' , message:"Admin account created successfully"})
            }
    }
    else {
        res.send("You don't have permissions to add admin")
    }
    }
    catch(error){
        res.send(error.message)
    }
})


// ------- XXXXXXXX --------

// ----- Get All Admins -----

app.post('/admin/getAll', async (req, res)=>{
    console.log('/admin/getAll hitted')
    console.log(req.body)
    const {adminId} = req.body
    const admin = await AdminModel.findById({_id: adminId})
    if(admin){
        const admins = await AdminModel.find()
        var dataToSend = []
        for(let i=0 ; i < admins.length ; i++){
            let dataObj = {
                id : admins[i]._id,
                name: admins[i].firstName + " " + admins[i].lastName,
                email: admins[i].email,
                access: admins[i].superAdmin ? "Super Admin" : "Admin",
                createdBy: admin.email
            }
            dataToSend[i] = dataObj
        }
        console.log("my data :",dataToSend)
        res.send({myType: 'Success' , message:"Successful", data: dataToSend})
    }
    else{
        res.send({myType: 'Error' , message:"Access Denied"})
    }
})

// ----- XXXXXXX -----

// ------ to Update Admin ------
app.post('/admin/update', async (req, res)=>{
    try{
        // const {adminId} = req.query
        const {firstName, lastName, email, password, superAdmin, createdBy, adminId, currentEmail} = req.body
    const admin = await AdminModel.findById({_id: adminId})
    if(admin && admin.superAdmin){
        const isExist = await AdminModel.findOne({email: currentEmail})
            if(!isExist){
                res.send("Admin account doesn't exist")
            }
            else{
                if(email !== currentEmail){
                 const user = await AdminModel.findOne({email})
                 if(user){
                    res.status(403).send('Cannot Update already existing email')
                 }
                 else{
                    await AdminModel.findByIdAndUpdate({_id : user._id}, {
                        $set: {firstName, lastName, email, password, superAdmin}
                    },
                    {new: true}
                    )
                    res.status(200).json("Admin account Updated successfully")
                 }
                }
                else{
               await AdminModel.findByIdAndUpdate({_id : isExist._id}, {
                    $set: {firstName, lastName, email, password, superAdmin}
                },
                {new: true}
                )
                res.status(200).json("Admin account Updated successfully")
              }
            }
        }
    }
    catch(error){
        res.send(error)
    }

})
// ------- XXXXXXX ------

// To delete admin -----

app.post('/admin/delete', async (req, res)=> {
    console.log('/admin/delete hitted')
    try{
        const {email, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin && admin.superAdmin){
            const isExist = await AdminModel.findOne({email})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Admin account doesn't exist"})
                }
                else{
                   await AdminModel.deleteOne({email})
                   res.send({myType: 'Success' , message:"Admin Deleted Successfully"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete admin"})
        }
        }
        catch(error){
            res.send(error.message)
        }
})

// ----- XXXXX ------

// For admin logging in --------

app.post('/admin', async (req, res)=>{
    console.log('/admin hitted')
    try {
        const {email, password} =req.body
        const admin = await AdminModel.findOne({email})
        if(!admin){
            res.send({myType: 'Error' ,message: "Enter valid Email/Password"})
        }
        else{
             const comparePass =  bcrypt.compareSync(password, admin.password);
              console.log(comparePass)
              if(comparePass){
                res.send({myType: 'Success' , message:"Signed in Successfully", data: admin})
              }
              else{
                res.send({myType: 'Error' ,message: "Enter valid Email/Password"})
              }
        }
    } catch (error) {
        
    }
})

// ------- XXXXXXXX --------

// ----- For Adding Content  ------

app.post('/admin/addContent', async (req, res)=>{
    console.log('admin/add-content hitted')
    try{
    // const {adminId} = req.query
    // const heroBody = req.body;

    const {
        subHead,
        type,
        image,
        heroImage,
        genres,
        OTT,
        language,
        trending,
        hero,
        duration,
        ratings: {
            direction,
            music,
            story,
            dialogue,
            performance
        },
        review,
        spoiler,
        seenWithParents,
        TIItake,
        emoji,
        trailer,
        createdBy,
        adminId
    } = req.body

    const title = req.body.title.toLowerCase()

    const isAdmin = AdminModel.findOne({email: adminId})

    if(isAdmin){
        const findTitle = await HeroSectionModel.findOne({title})
        // console.log(findTitle)
        if(!findTitle){
        await HeroSectionModel.create(
            {
                title,
        subHead,
        type,
        image,
        heroImage,
        genres,
        OTT,
        language,
        trending,
        hero,
        duration,
        ratings: {
            direction,
            music,
            story,
            dialogue,
            performance
        },
        review,
        spoiler,
        seenWithParents,
        TIItake,
        emoji,
        trailer,
        createdBy,
            }
        )
    res.send({myType: 'Success',message: 'Data for hero Section added successfully'})
    }
    else{
        res.send({myType: 'Error',message: 'Title Already Exists'})
    }
}

    else{
        res.send({myType: 'Error',message: 'Access Denied'})
    }
    }

    catch(error){
        res.send({myType: 'Error',message: error.message})
    }

    

})



// ------ XXXXXXX ------

// ----- For Getting Content  ------

app.get('/admin/getContent', async (req, res)=>{
    console.log('/admin/getContent hitted')
    try{
        const myData = await HeroSectionModel.find()
        // console.log('my data :', myData)

        res.send({myType: 'Success',message: 'Getting Data Successful', data: myData})
    }
    catch(error){
        // res.send({myType: 'Error',message: error.message})
        console.log(error.message)
    }
})

app.post('/admin/getSearchedContent', async (req, res)=>{
    console.log('/admin/getSearchedContent hitted')

    
    const searchText =req.body.searchText.toLowerCase()
    // console.log(searchText)

    try{
        const myData = await HeroSectionModel.find()

        let dataToSend = []

        for(let i = 0 ; i < myData.length ; i++){
            // console.log(myData[i].title)
            if(myData[i].title.includes(searchText)){
                dataToSend.push(myData[i])
            }
        }

        // console.log('my data :', dataToSend.length)

        res.send({myType: 'Success',message: 'Getting Data Successful', data: dataToSend})
    }
    catch(error){
        // res.send({myType: 'Error',message: error.message})
        console.log(error.message)
    }
})

app.post('/admin/getOneContent', async (req, res)=>{
    console.log('/admin/getOneContent hitted')
    try{
        const {_id} = req.body
        const myData = await HeroSectionModel.findOne({_id})
        // console.log('my data :', myData)
        if(myData){
            res.send({myType: 'Success',message: 'Getting Data Successful', data: myData})
        }
        else{
            res.send({myType: 'Error',message: 'Invalid Content'})
        }
    }
    catch(error){
        res.send({myType: 'Error',message: 'Invalid Content'})
    }
})

app.post('/admin/getPersonalizedContent', async (req, res)=>{
    console.log('/admin/getPersonalizedContent hitted')
    console.log(req.body)
    try{
        const {type, subType} = req.body
        var sendData = []

        if(type==='genre'){
            const myData = await HeroSectionModel.find({"genres": {$in: [subType]}})
            // console.log('my data :', myData)
            if(myData){
                res.send({myType: 'Success',message: 'Getting Data Successful', data: myData})
                // sendData = myData
            }
            else{
                res.send({myType: 'Error',message: 'Invalid Content'})
            }
        }
        else if(type==='ott'){
            const myData = await HeroSectionModel.find({"OTT": {$in: [subType]}})
            // console.log('my data :', myData)
            if(myData){
                res.send({myType: 'Success',message: 'Getting Data Successful', data: myData})
                // sendData = myData
            }
            else{
                res.send({myType: 'Error',message: 'Invalid Content'})
            }
        }

        else if(type==='genreAfter'){
            console.log('genreAfter type')
            const myData = await HeroSectionModel.find({"OTT": {$in: [subType]}})
            if(myData){
                for(let i = 0 ; i < myData.length ; i++){
                   if (myData[i].genres.includes(req.body.new)){
                        sendData = [...sendData, myData[i]]
                   }
                }
                // console.log('sendData :', sendData)
                res.send({myType: 'Success',message: 'Getting Data Successful', data: sendData})
            }
            else{
                res.send({myType: 'Error',message: 'Invalid Content'})
            }
        }

        else if(type==='ottAfter'){
            console.log('ottAfter type')
            const myData = await HeroSectionModel.find({"genres": {$in: [subType]}})
            // console.log('my data :', myData)
            if(myData){
                for(let i = 0 ; i < myData.length ; i++){
                   if (myData[i].OTT.includes(req.body.new)){
                        sendData = [...sendData, myData[i]]
                   }
                }
                res.send({myType: 'Success',message: 'Getting Data Successful', data: sendData})
            }
            else{
                res.send({myType: 'Error',message: 'Invalid Content'})
            }
        }

        else{
            res.send({myType: 'Error',message: 'Invalid Content'})
        }
       
    }
    catch(error){
        console.log(error)
        res.send({myType: 'Error',message: 'Invalid Content'})
    }
})

app.post('/content/delete', async (req, res)=> {
    console.log('/content/delete hitted')
    try{
        const {contentId, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin){
            const isExist = await HeroSectionModel.findOne({_id:contentId})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Content doesn't exist"})
                }
                else{
                   await HeroSectionModel.deleteOne({_id:contentId})
                   res.send({myType: 'Success' , message:"content Successfully Deleted"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete content"})
        }
        }
        catch(error){
            res.send({myType: 'Error' , message : error.message})
        }
})

// ------ XXXXXXX ------

// ----- For Contact ------

app.post('/contact',async (req, res)=>{
    console.log('/contact hitted')
    const {email, message} = req.body
    if(email.includes('@') && email.includes('.co')){
        await ContactModel.create({email, message})
        res.send({myType: 'Success', message: 'Contact Request Sent Successfully'})
        console.log(req.body)
    }
})

app.post('/contact/getAll',async (req, res)=>{
    console.log('/contact/getAll hitted')
    console.log(req.body)
    const {adminId} = req.body
    const admin = await AdminModel.findById({_id: adminId})
    if(admin){
        const data = await ContactModel.find().sort({createdAt: -1})
        res.send({myType: 'Success' , message:"Successful", data})
    }
    else{
        res.send({myType: 'Error' , message:"Access Denied"})
    }
})

app.post('/contact/delete', async (req, res)=> {
    console.log('/contact/delete hitted')
    try{
        const {contactId, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin){
            const isExist = await ContactModel.findOne({_id:contactId})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Contact Request doesn't exist"})
                }
                else{
                   await ContactModel.deleteOne({_id:contactId})
                   res.send({myType: 'Success' , message:"Contact Successfully Deleted"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete contact"})
        }
        }
        catch(error){
            res.send({myType: 'Error' , message : error.message})
        }
})


// ----- XXXXXX ------


//  ----- For Adding Question -----

app.post('/question/add',async (req, res)=>{
    console.log('/question/add hitted')
    try{
    // const {adminId} = req.query
    // const heroBody = req.body;

    const {adminId, question, createdBy} = req.body

    const isAdmin = AdminModel.findOne({_id: adminId})

    const data =  await AskIdiotModel.find()

    if(isAdmin){
        if(data.length >= 3){
        res.send({myType: 'Error',message: 'There are already 3 questions in the database. You have to delete question to add this one.'})
        }
        else{
            await AskIdiotModel.create({question, createdBy})
        res.send({myType: 'Success',message: 'Question added successfullyy'})
        }
        
}

    else{
        res.send({myType: 'Error',message: 'Access Denied'})
    }
    }

    catch(error){
        res.send({myType: 'Error',message: error.message})
    }


})

app.post('/question/getAll',async (req, res)=>{
    console.log('/question/getAll hitted')
    try{
       const data =  await AskIdiotModel.find()
    res.send({myType: 'Success',message: 'Question added successfully', data})
}
    catch(error){
        res.send({myType: 'Error',message: error.message})
    }
})

app.post('/question/delete', async (req, res)=> {
    console.log('/question/delete hitted')
    try{
        const {questionId, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin){
            const isExist = await AskIdiotModel.findOne({_id:questionId})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Question doesn't exist"})
                }
                else{
                   await AskIdiotModel.deleteOne({_id:questionId})
                   res.send({myType: 'Success' , message:"Question Successfully Deleted"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete question"})
        }
        }
        catch(error){
            res.send({myType: 'Error' , message : error.message})
        }
})

// ---- XXXXXXX ------

//  ----- For Adding Answers -----

app.post('/answer/add',async (req, res)=>{
    console.log('/answer/add hitted')
    try{
    // const {adminId} = req.query
    // const heroBody = req.body;

    const {question, name, stayAnonymous, answer} = req.body

        console.log(req.body)
        await AskIdiotAnswerModel.create({question, name, stayAnonymous, answer})
    res.send({myType: 'Success',message: 'Answer added successfully'})

    }

    catch(error){
        res.send({myType: 'Error',message: error.message})
        console.log(error)
    }


})

app.post('/answer/getAll',async (req, res)=>{
    console.log('/answer/getAll hitted')

    const {adminId} = req.body

    const isAdmin = AskIdiotAnswerModel.findOne({_id: adminId})

    if(isAdmin){
    try{
      const data =  await AskIdiotAnswerModel.find()
    res.send({myType: 'Success',message: 'Answer successfully fetched', data})
}
    catch(error){
        res.send({myType: 'Error',message: error.message})
    }
}
else{
    res.send({myType: 'Error',message: 'Access Denied'})
}
})


app.post('/answer/delete', async (req, res)=> {
    console.log('/answer/delete hitted')
    try{
        const {answerId, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin){
            const isExist = await AskIdiotAnswerModel.findOne({_id:answerId})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Answer doesn't exist"})
                }
                else{
                   await AskIdiotAnswerModel.deleteOne({_id:answerId})
                   res.send({myType: 'Success' , message:"Answer Successfully Deleted"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete answer"})
        }
        }
        catch(error){
            res.send({myType: 'Error' , message : error.message})
        }
})

// ---- XXXXXXX ------



// Api Routes for Collection 

// ----- For Adding Section  ------

app.post('/admin/addSection', async (req, res)=>{
    console.log('admin/add-section hitted')
    try{
    // const {adminId} = req.query
    // const heroBody = req.body;

    const {
        title, entries, adminId, createdBy
    } = req.body

    const isAdmin = AdminModel.findOne({email: adminId})

    if(isAdmin){
        const findTitle = await SectionModel.findOne({title})
        // console.log(findTitle)
        if(!findTitle){
        await SectionModel.create(
            {
                title,
                entries,
                createdBy
            }
        )
    res.send({myType: 'Success',message: 'Section added successfully'})
    }
    else{
        res.send({myType: 'Error',message: 'Section Already Exists'})
    }
}

    else{
        res.send({myType: 'Error',message: 'Access Denied'})
    }
    }

    catch(error){
        res.send({myType: 'Error',message: error.message})
    }

    

})

// ----- For Getting Section
app.get('/admin/getSection', async(req, res)=>{
    console.log('/admin/getSection hitted')
    try {
        const data = await SectionModel.find()
        res.send({myType: 'Success',message: 'Section Fetched Successfully', data})
    } catch (error) {
        res.send({myType: 'Error',message: 'Failed to fetch section Data'})
    }
 
})


//  For Deleting Section

app.post('/admin/deleteSection', async (req, res)=> {
    console.log('/admin/deleteSection hitted')
    try{
        const {sectionId, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin){
            const isExist = await SectionModel.findOne({_id:sectionId})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Section doesn't exist"})
                }
                else{
                   await SectionModel.deleteOne({_id:sectionId})
                   res.send({myType: 'Success' , message:"Section Successfully Deleted"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete section"})
        }
        }
        catch(error){
            res.send({myType: 'Error' , message : error.message})
        }
})




// Api Routes for Join Us 

// ----- For Adding Join  ------

app.post('/joinUs/add', async (req, res)=>{
    console.log('/joinUs/add hitted')
    console.log(req.body)
    try{

    const {
        designation, brief, details, link
    } = req.body.values

    const {adminId, createdBy, requirements} = req.body

    const isAdmin = AdminModel.findOne({email: adminId})

    if(isAdmin){
        const findTitle = await JoinUsModel.findOne({designation})
        // console.log(findTitle)
        if(!findTitle){
        await JoinUsModel.create(
            {
                designation, brief, requirements, details, link, createdBy
            }
        )
    res.send({myType: 'Success',message: 'Join Us Data added successfully'})
    }
    else{
        res.send({myType: 'Error',message: 'Join Us Data Already Exists'})
    }
}

    else{
        res.send({myType: 'Error',message: 'Access Denied'})
    }
    }

    catch(error){
        res.send({myType: 'Error',message: error.message})
    }

    

})

// ----- For Getting Join Us
app.get('/joinUs/get', async(req, res)=>{
    console.log('/joinUs/get hitted')
    try {
        const data = await JoinUsModel.find()
        res.send({myType: 'Success',message: 'Join Us Data Fetched Successfully', data})
    } catch (error) {
        res.send({myType: 'Error',message: 'Failed to fetch Join Us Data'})
    }
 
})

// ----- For Getting One Join Us
app.post('/joinUs/getOne', async(req, res)=>{
    const {designation} = req.body
    console.log(designation)
    console.log('/joinUs/getOne hitted')
    try {
        const data = await JoinUsModel.findOne({designation})
        console.log('data : ', data)
        res.send({myType: 'Success',message: 'Join Us Data Fetched Successfully', data})
    } catch (error) {
        res.send({myType: 'Error',message: 'Failed to fetch Join Us Data'})
        console.log('err :', error)
    }
 
})


//  For Deleting Join Us

app.post('/joinUs/delete', async (req, res)=> {
    console.log('/joinUs/delete hitted')
    try{
        const {joinUsId, adminId} = req.body
        const admin = await AdminModel.findById({_id: adminId})
        // console.log(admin)
        if(admin){
            const isExist = await JoinUsModel.findOne({_id:joinUsId})
                if(!isExist){
                    res.send({myType: 'Error' , message:"Join Us Data doesn't exist"})
                }
                else{
                   await JoinUsModel.deleteOne({_id:joinUsId})
                   res.send({myType: 'Success' , message:"Join Us Data Successfully Deleted"})
                }
        }
        else {
            res.send({myType: 'Error' , message:"You don't have permissions to delete Join Us Data"})
        }
        }
        catch(error){
            res.send({myType: 'Error' , message : error.message})
        }
})






app.listen(4001, () =>{
    console.log('connected to port succcessfully')
})