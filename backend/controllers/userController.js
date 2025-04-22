const jwt = require("jsonwebtoken");
const userModel=require("../models/User")
const bcrypt = require("bcrypt")

// const loginuser = async(req,res) =>{
//   const email=req.body.email
//   const password=req.body.password

//   const founduserbyEmail = await userModel.findOne({email:email}).populate("roleId")
//   console.log(founduserbyEmail)

//   if (founduserbyEmail!=null){

//     const isMatch = bcrypt.compareSync(password,founduserbyEmail.password)

//     if (isMatch==true){
//       res.status(200).json({
//         message:"login success",
//         data:founduserbyEmail
//       })
//     }else{
//       res.status(404).json({
//         message:"invalid credentials..."
//       })
//     }
//   }else{
//     res.status(404).json({
//       message:"email does not exist"
//     })
//   }
// }


const loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await userModel.findOne({ email }).populate("roleId");

    if (!foundUser) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const isMatch = bcrypt.compareSync(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // ✅ Return user + token
    res.status(200).json({
      message: "Login success",
      data: {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.roleId,
        token, // ✅ this is what the frontend needs!
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const signup = async (req,res) =>{
  try{
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password,salt)
    req.body.password=hashedPassword
    const createdUser = await userModel.create(req.body)
    
    res.status(201).json({
      message:"user created...",
      data:createdUser
    })

  }catch (err) {
    console.log(err)
    res.status(500).json({
      message: "error",
      data: err,
    })
  }
}

const getAllUsers = async (req,res) =>{
 
    const users = await userModel.find().populate('roleId')
    res.json({
        message: "role fetched successfully",
        data:users
      });
      
}        
 const getUserbyId = async (req,res) =>{
  const founduser= await userModel.findById(req.params.id)
  res.json({

    message:"role fetched successfully",
    data:founduser
  })
 }
 const addUser = async (req,res)=>{
  const savedRole=await userModel.create(req.body)
  
    res.json({
      message:"role created",
      data:savedRole
    })
}
const deleteUser = async(req,res)=>{ const deleteUser = await roleModel.findByIdAndDelete(req.params.id)

  res.json({
    message:"role deleted successfully..",
    data:deletedRole
  })
}

// In userController.js
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user", data: err });
  }
};

module.exports = { getAllUsers, getUserbyId, addUser, deleteUser, loginuser, signup, updateUser };

