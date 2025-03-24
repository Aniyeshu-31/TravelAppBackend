import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Register User
export const registerUser = async (req, res, next) => {
  const { username, email, password, photo } = req.body

  // Validate email format
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          'Invalid email format. Please provide a valid email with a proper domain (e.g., .com, .in, .org).',
      })
  }

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photo,
    })

    await newUser.save()
    res.status(200).json({ success: true, message: 'Successfully registered!' })
  } catch (err) {
    console.error('Registration Error:', err)
    res
      .status(500)
      .json({ success: false, message: 'Unable to register the user!' })
  }
}

// Login User
export const LoginUser = async (req, res, next) => {
    try {
        const email = req.body.email;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Incorrect password!' });
        }

        // Destructure user object excluding sensitive information
        const { password, role, ...rest } = user._doc;

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15d' }
        );

        // Set token in browser cookies and send response
        res.cookie('accessToken', token, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully!',
            data: { ...rest },
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Failed to log in!' });
    }
};
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// export const registerUser= async(req,res,next)=>{
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password,salt); 
//        try {
//         const newUser = new User({
//             username:req.body.username,
//             email:req.body.email,
//             password:hashedPassword,
//             photo:req.body.photo
//         });

//         await newUser.save();
//         res.status(200).json({success:true,message:'Successfully registered!'});
//     } catch (err) {
//         res.status(500).json({success:false,message:'Unable to register the User!!'});
//     }
// }
// export const LoginUser = async(req,res,next)=>{
//     try {
//         const email = req.body.email;
//        const user = await User.findOne({email});
//        if(!user){
//         res.status(404).json({success:false ,message:'User not Found!!'});
//        }
//        const checkpassword = await bcrypt.compare(req.body.password,user.password);

//        if(!checkpassword){
//         return res.status(401).json({success:false,message:'User password is incorrect'});
//        }

//        const {password,role,...rest}=user._doc;

//        const token = jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET_KEY,{expiresIn:'15d'});

//        // set token in browser cookies and send it to the client in the response

//        res.cookie('accessToken',token,{
//         httpOnly:true,
//         expiresIn:token.expiresIn
//        }).status(200).json({success:true,message:'LoggedIn Successfully!!' ,data:{...rest}});
//     } catch (err) {
//         console.log(err);
//         return res.status(401).json({success:false,message:'Failed To Login'});
//     }
// }
