import { generateToken } from "../../utils/generateJWT.js";
import prisma from "../../utils/prismaClient.js";
import argon2 from "argon2";
import { redis } from "../config/redisClient.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    loginUser.role = 'user';
    
        return res.status(200).json({
            message: "user validated successfully",
            loginUser
         })
    }

}
// *********************************************************

export const logoutUser = async (req, res) => {
  try {
    return res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }).status(200).json({
      message: "user logout successfully",
    })
  } catch (err) {
    res.status(500).json({
      message: 'unable to logout user' && err?.message
    })
  }
}

// ********************************************************************

export const saveOrderSummary = async(req , res)=>{
  try {
    const {orderSummary} = req.body;

    console.log({ orderSummary });
    if(orderSummary){
      const cacheKey = 'cacheOrder'
      await redis.set(cacheKey, JSON.stringify(orderSummary), {
        EX: 600,
      });
    }

    return res.status(201).json({
      message: 'Order cached succesfully valid for 10Mints'
    })
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || "server error"
    })
  }
}

//********************************************************************** */
export const getOrderSummary = async (req, res) => {
  try {
    const cacheKey = 'cacheOrder';

    const cachedOrderSummary = await redis.get(cacheKey);
   if(!cachedOrderSummary){
    return res.status(404).json({
      message: "order summary not found"
    });
    }
    return res.status(200).json({
      message: "order summary fetched successfully",
      orderSummary: JSON.parse(cachedOrderSummary)
    })

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "server error"
    })
    
  }
}
// *****************************************************************

export const getAllOrders = async(req , res)=>{
  try {
    const { userId } = req.loginUser;
    const cacheKey = `orders:${userId}`;
    const cachedOrders = await redis.get(cacheKey);
    if (cachedOrders) {
      return res.status(200).json({
        message:"orders fetched successfully",
        orders: JSON.parse(cachedOrders),
        source: 'cache',
        success: true
      })
    }
    

    const fetcheAllOrders = await prisma.checkoutOrder.findMany({
      include: {
        items: true,
        user: {
          omit: {
            password: true
          }
        }
      }
    });


    await redis.set(cacheKey, 
      JSON.stringify(fetcheAllOrders),{
        EX:300
      }
    )
    

    return res.status(200).json({
      message: "orders fetched succesfully",
      source: 'database',
      orders: fetcheAllOrders,
      success: true
    })
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: e.message || "Server Error"
    })
    
  }
}

// **************************************************

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.loginUser;
    const cacheKey = `user:${userId}:details`
    const cacheUser = await redis.get(cacheKey);

    if (cacheUser) {
      return res.status(200).json({
        message: "user details fetched",
        user: JSON.parse(cacheUser),
        source: 'cache'
      });
    };
    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      omit: {
        password: true
      }
    });


    if (!dbUser) {
      return res.status(404).json({
        message: 'User deatils not found'
      })
    }

    await redis.set(cacheKey,
      JSON.stringify(dbUser),
      {
        EX: 600
      }
    );

    res.status(200).json({
      message: 'User fetched', 
      source: 'Database',
      user:dbUser
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.error || "Server error"
    })
    
  }
}