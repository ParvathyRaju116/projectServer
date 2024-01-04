const { json } = require("express");
const users=require("../Models/userModel")
const jwt=require('jsonwebtoken');
const projects = require("../Models/projectModal");

// register
exports.register=async(req,res)=>{

    const{userName,email,password}=req.body 
   
 try{   
    const existingUser=await  users.findOne({email})
    if(existingUser){
        res.status(400).json("User Already Exist !! Please Pogin.")
    }
    else{
        const newUser=new users({
            userName,email,password,github:"",linkedIn:"",profile:""
        })

        //store the new object in db collection
        await newUser.save()
        res.status(200).json(newUser)
    }
}
catch(err){
    res.status(401).json(`Register api faild ${err}`)
}

}

// login
exports.login=async(req,res)=>{
    const {email,password}=req.body
  try { const existUser=await users.findOne({email,password})
    if(existUser){

//    login success - token generate
     
      const token=jwt.sign({_id:existUser._id},"supersecretkey123")
      console.log(token);


    res.status(200).json({  
    user:existUser,
    token
     })
    }
    else{
        res.status(404).json("incorrect email or password")
    }
}
catch(err){
    res.status(401).json(`Register api failed ${err}` )
}
}

// edit profile
exports.editProfile=async(req,res)=>{
  const {userName,gitHub,linkedIn,profile}=req.body
  const {_id}=req.params
  const profile1=req.file?req.file.filename:profile 
 
 try{
  const selectedUser=await users.findOne({_id})
  if(selectedUser){
    selectedUser.userName=userName
    selectedUser.gitHub=gitHub
    selectedUser.linkedIn=linkedIn
    selectedUser.profile=profile1

    // save changes in mongodb
    await selectedUser.save()
    res.status(200).json(selectedUser)   
  }

  else{
    res.status(404).json(`${userName} is not present`)

  }

}
catch(err){
  res.status(401).json(`Register api failed ${err}` )
}

  // console.log(userName);
  // console.log(_id);
  // console.log(profile);
  // res.send("edit profile request recived")
}

// add Projects
exports.addProject=async(req,res)=>{
  const {title,languages,overView,gitHub,website}=req.body
  //image
  const projectImage=req.file?.filename
  //userId
  const userId=req.payload

  try{
   const existingProject= await projects.findOne({gitHub})
   if(existingProject){
    res.status(400).json(`${existingProject.title} already exist !`)
   }
   else{
   const newProject= new projects({
      title,languages,overView,gitHub,website,projectImage,userId
    })
    //save in mongoDB
    newProject.save()
    res.status(200).json(newProject)
   }
  }
  catch(err){
    res.status(401).json(`add project Api Failed ${err}`);

  }
}

// get user projects

exports.getUserProjects = async (req, res) => {
  const { id } = req.params;
  try {
    const projectsArray = await projects.find({ userId: id });
    if (projectsArray) {
      res.status(200).json(projectsArray);
    } else {
      res.status(404).json("no projects uploaded yet");
    }
  } catch (err) {
    res.status(401).json(`Project get Api Failed ${err}`);
  }
};


// get all projects


exports.getAllProjects=async(req,res)=>{
// query data
  const searchQuery=req.query.search 

  try {
  // regularexpression query
    const query={
      languages:{ $regex:searchQuery, $options:"i"}   // i --> caseinsencitive
    }
    const allProjectsArray = await projects.find(query);
    if (allProjectsArray) {
      res.status(200).json(allProjectsArray);
    } else {
      res.status(404).json("no projects uploaded yet");
    }
  } catch (err) {
    res.status(401).json(`Project get Api Failed ${err}`);
  }
}

exports.getHomeProjects=async(req,res)=>{
  try {
    const homeProjectsArray = await projects.find().limit(3)
    if (homeProjectsArray) {
      res.status(200).json(homeProjectsArray);
    } else {
      res.status(404).json("no projects uploaded yet");
    }
  } catch (err) {
    res.status(401).json(`Project get Api Failed ${err}`);
  }
}

exports.editProject = async (req, res) => {
  const { title, languages, overView, gitHub, website, projectImage } =
    req.body;
  const { _id } = req.params;
  const uploadImage = req.file ?req.file.filename : projectImage;

  try {
    const updatedProject = await projects.findByIdAndUpdate(
      { _id },
      {
        title,
        languages,
        overView,
        gitHub,
        website,
        projectImage: uploadImage,
      },
      { new: true }
    );
    await updatedProject.save();
    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(401).json(`Project get Api Failed ${err}`);
  }
};


// delete ptoject
exports.deleteProject=async(req,res)=>{
  const {_id}=req.params
  try{
   const response= await  projects.deleteOne({_id})
   if(response){
    res.status(200).json("project deleted")
   }
  }
  catch(err){
    req.status(401).json(`Project delete api Failed ${err}`)
  }
}
