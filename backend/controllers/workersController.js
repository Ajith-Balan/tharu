import workersModel from "../models/workers.model.js";
import nodemailer from 'nodemailer'
import {comparePassword,  hashPassword } from "../helpers/authhelper.js";
import JWT from "jsonwebtoken"
import dotenv from 'dotenv'
import axios from 'axios'




dotenv.config()

export const registerController = async (req,res)=>{
try {
    const { name, phone,aadhar,empid,wage,acnumber,ifsccode,bank,branch,uanno,esino,designation } = req.body; 
    if (!name) {
        return res.send({ error: "Name is Required" });
      }
     
    
      if (!aadhar) {
        return res.send({ message: "Phone no is Required" });
      }
      // }   if (!type) {
      //   return res.send({ message: "type is Required" });
      // }
   
   

    //check user
    const exisitingUser = await workersModel.findOne({ aadhar });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        msg: "Already worker  ",
      });
    }
    //register user
    //save
    const user = await new workersModel({
       name,
        phone,
        aadhar,
        empid,
        wage,
        acnumber,
        ifsccode,
        uanno,
        esino,
        bank,
        branch,
        designation
      
    }).save();

    
    res.status(201).send({
      success: true,
      msg: "worker Register Successfully"
      
    });
} catch (error) {
    console.log(error);
    res.status(500).send({success:false,msg:"error in create worker",error})
    
}
}



export async function getworkers(req,res){
  try{
    

      const workers=await workersModel.find();
      res.status(200).send(workers)
  }catch (error){
      res.status(500).send(error)
  }
}




export async function getOneworker(req,res){
  try{
    
      const {id}=req.params;

      const worker=await workersModel.find({_id:id});
      res.status(200).send(worker)
  }catch (error){
      res.status(500).send(error)
  }
}

  

  export const updateProfile = async (req, res) => {
    try {
    

      const {  name, phone,aadhar,empid,wage,accnumber,ifscode,uanno,esino,designation  } = req.body;
  
      // Find the user by ID
      const {id}=req.params;

      const user = await workersModel.findById({_id:id});

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "worker not found",
        });
      }
  
      // Create an object to store updated fields
      const updatedData = {
        name: name || user.name,
        phone: phone || user.phone,
        empid: empid || user.empid,
        aadhar:aadhar || user.aadhar,
         wage:wage || user.wage,
        accnumber:accnumber || user.accnumber,
        ifscode:ifscode || user.ifscode,
        uanno:uanno || user.uanno,
        esino:esino || user.esino,
        designation:designation || user.designation

      };
  
      // If password is provided, hash it (assuming you have a function for hashing passwords)
   
      // Update the user's profile
      const updatedWorker = await workersModel.findByIdAndUpdate({_id:id}, updatedData, { new: true });
  
      res.status(200).send({
        success: true,
        message: "worker updated successfully",
        updatedWorker,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Error while updating profile",
        error,
      });
    }
  };
  




// Import necessary modules

export const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate inputs
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New password is required" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid user",
      });
    }

    // Hash the new password and update the user
    const hashed = await hashPassword(newPassword);
    await userModel.updateOne({ email }, { $set: { password: hashed } });

    // Send success response
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};






  

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port:587, //465 true
    secure:false, // You can change this to your email service provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address from the environment variables
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });
  
  // Generate a 6-digit OTP
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); 
  
  // Store OTPs temporarily (consider using a database for production)
  const otpStore = {}; 

  export const Forget = async (req, res) => {
    const { email } = req.body;
    
    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: "User not found " });
    }
  
    const otp = generateOtp(); // Generate OTP
    otpStore[email] = otp; // Store OTP for verification
    const mailOptions = {
      from: {
        name: 'THARU & SONS',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: 'Your OTP Code for THARU & SONS',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0044cc; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">THARU & SONS</h2>
            </div>
            <div style="padding: 20px;">
              <h3>Hello,</h3>
              <p>Thank you for choosing THARU & SONS. To proceed with your request, please use the OTP code provided below:</p>
              <p style="text-align: center; font-size: 24px; font-weight: bold; color: #0044cc;">${otp}</p>
              <p>If you did not request this code, please ignore this email.</p>
              <p>Thank you,<br>THARU & SONS Team</p>
            </div>
            <div style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 12px; color: #777;">
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </div>
      `,
    };
    
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
  };
  




  export const verifyotp = async (req, res) => {
    const { email, otp } = req.body;
  
    // Check if the OTP matches
    if (otpStore[email] === otp) {
      delete otpStore[email]; // OTP verified, remove it
      res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
      res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }
  };
  


  export const findifsc = async (req, res) => {
    try {
    const { code } = req.params;
    const response = await axios.get(`https://ifsc.razorpay.com/${code}`);
    res.json(response.data); // Forward the response to frontend
  } catch (error) {
    res.status(400).json({ error: 'Invalid IFSC code or API error' });
  }
  };











export const attendanceController = async (req,res)=>{
try {
    const { name,empid,attendance,wage } = req.body; 
    if (!name) {
        return res.send({ error: "Name is Required" });
      }

    const user = await new workersModel({
       name,
        empid,
        wage
    }).save();

    res.status(201).send({
      success: true,
      msg: "Attendance added"
      
    });
} catch (error) {
    console.log(error);
    res.status(500).send({success:false,msg:"error in create worker",error})
    
}
}


