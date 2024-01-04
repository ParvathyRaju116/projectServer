const express=require('express')

// router objcet 
const router=new express.Router()
const user=require('../Controllers/userControle')
const upload = require('../middlewares/multerMiddleWare')
const { jwtMiddleWare } = require('../middlewares/twtmiddleware')
const projects = require('../Models/projectModal')



// sign up

router.post('/user/register',user.register)

// login 
router.post('/user/login',user.login)

// update Profile
router.put('/user/update-profile/:_id',jwtMiddleWare,upload.single('profile'),user.editProfile)

// add new project
router.post('/user/add-project',jwtMiddleWare,upload.single('projectImage'),user.addProject)

// get user project
router.get('/user/get-user-project/:id',jwtMiddleWare,user.getUserProjects)

// get all projects

router.get('/user/get-all-project',user.getAllProjects)

// get home projects
router.get('/user/get-home-project',user.getHomeProjects) 

// update project
router.put('/user/edit-project/:_id',jwtMiddleWare,upload.single('projectImage'),user.editProject)

// delete project 
router.delete('/user/delete-project/:_id',jwtMiddleWare,user.deleteProject)



module.exports=router 


