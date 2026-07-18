import { generateToken } from "../../utils/generateJWT.js";
import prisma from "../../utils/prismaClient.js";
import argon2 from "argon2";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    const emailInDB = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailInDB) {
      return res.status(400).json({
        message: " Email Already Exist , Try to Login",
      });
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: `User Registered with name ${firstName} ${lastName} .`,
      success: "true",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};
// *******************************************************************
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    const isPasswordMatched = await argon2.verify(user.password, password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }

      const token = generateToken(user.id);
      
      
    return  res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:'/',
        maxAge: 60*60*1000,
    }).status(200).json({
      message: `User ${user.lastName} has logged in successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// **********************************************************

export const getLoginUser = async (req, res) => {

    const loginUser = await prisma.user.findUnique({
        where: {
            id: req.loginUser.userId
      },
      omit: {
        password:true
      }
    });
  if (loginUser) {
    
        return res.status(200).json({
            message: "user validated successfully",
            loginUser
         })
    }

}
// *********************************************************

export const logoutUser = async (req, res) => {
  try {
    return res.clearCookies("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (err) {
    res.status(500).json({
      message: 'unable to logout user' && err?.message
    })
  }
}
