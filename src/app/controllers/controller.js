const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");
const User = require('../models/user');
const MyEmployee=require('../models/myEmployee')


let originallyCode;
const resetToken = Math.floor(100000 + Math.random() * 900000);

class controller{

    // post[/register]
    async register (req, res)  {
        try {
          const { email, password, name, phone, address } = req.body;

          let imgUser = "";
          const imagePath = path.join(__dirname, "../../resources/uploads/user.jpg");
          try {
            const buffer = await fs.readFile(imagePath);
            imgUser = buffer.toString("base64");;
            
          } catch (fileError) {
            console.error("Error reading image file:", fileError);
            return res.status(500).json({ message: "Error reading image file" });
          }

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res
              .status(409)
              .json({ message: "Email has already been registered" });
          }
      
      
          const newUser = new User({
            email,
            password,
            name,
            phone,
            address,
            img:imgUser,
          });
      
          await newUser.save();
      
          res.status(201).json({ message: "Registration successful" });
        } catch (error) {
          res.status(500).json({ message: "Error" });
        }
      }

    //   post[/login]
    async login (req, res){
        try {
          const { email, password } = req.body;
      
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: "The user does not exist" });
          }
      
      
          if (password!=user.password) {
            return res.status(401).json({ message: "Password is incorrect" });
          }
          const userWithInfo = {
            id:user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            phone: user.phone,
            address: user.address,
            img:user.img,
          };
      
          res.status(200).json(userWithInfo);
        } catch (error) {
          res.status(500).json({ message: "Error" });
        }
      }

    //   get[/users/:id]
    async getUserById (req, res)  {
        const userId = req.params.id;
      
        try {
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          return res.status(200).json(user);
        } catch (error) {
          console.error("Error retrieving user:", error);
          return res.status(500).json({ message: "Server error" });
        }
      }

    //   put[/users/:id]
    async updateUserById (req, res){
        const userId = req.params.id;
        const updateFields = req.body; 
        
        try {
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
      
          const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
          
          if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
          }
      
          return res.status(200).json(updatedUser);
        } catch (error) {
          console.error("Error updating user:", error);
          return res.status(500).json({ message: "Server error" });
        }
      }

      // post[/resetpassword/request]
      async resetpasswordRequest (req, res) {
        try {
          const { email } = req.body;
      
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: "User does not exist" });
          }
      
    
          originallyCode = resetToken;
      
          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              // user: "",
              // pass:"" ,
            },
          });
      
          const mailOptions = {
            // from: "",
            to: email,
            subject: "Reset Password Confirmation Code",
            text: `Your reset confirmation code is: ${resetToken}`,
          };
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).json({ message: "Error sending email" });
            } else {
              console.log("Email sent: " + info.response);
              console.log("Token: " + resetToken);
              res.status(200).json({ message: "Reset password code sent to email" });
            }
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error" });
        }
      }
 
      // post[/resetpassword/confirm]
      async resetpasswordComfirm(req, res){
        try {
          const { email, resetToken, newPassword } = req.body;
      
          const user = await User.findOne({ email });
          
          if (resetToken !== originallyCode) {
            return res.status(401).json({ message: "Invalid reset code" });
          }
      
          user.password = newPassword;
          await user.save();
      
          res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error" });
        }
      }
      // post[/employees]

      async addnewEmployee (req, res)  {
        try {
          const { userId, email, name, gender, role, phone, address, imageBase64 } = req.body;
          const imageUrl = req.body.image; 
      
          const existingEmployee = await MyEmployee.findOne({ email });
          if (existingEmployee) {
            return res
              .status(409)
              .json({ message: "Employee with this email already exists" });
          }
      
          const newEmployee = new MyEmployee({
            userId,
            email,
            name,
            gender,
            image: imageUrl, 
            role,
            phone,
            address,
          });
      
          await newEmployee.save();
      
          res.status(201).json({ message: "Employee created successfully" });
        } catch (error) {
          res.status(500).json({ message: "Error" });
        }
      }

      // get[/employees/:userId]
      async getEmployees(req, res){
        try {
          const userId = req.params.userId;
          const employees = await MyEmployee.find({ userId }); 
          res.status(200).json(employees);
        } catch (error) {
          res.status(500).json({ message: "Error" });
        }
      }
      // put[/employees/:id]

      async updateEmployee(req, res){
        try {
          const id = req.params.id;
          const updateData = req.body;
      
          const updatedEmployee = await MyEmployee.findByIdAndUpdate(id, updateData, { new: true });
      
          if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
          }
      
          res.status(200).json(updatedEmployee);
        } catch (error) {
          res.status(500).json({ message: "Error" });
        }
      }
      
      // delete[/employees/:id]
      async deleteEmployee(req, res)  {
        try {
          const id = req.params.id;
      
          const deletedEmployee = await MyEmployee.findByIdAndRemove(id);
      
          if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
          }
      
          res.status(200).json({ message: "Employee deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Error" });
        }
      }


}


module.exports=new controller();
