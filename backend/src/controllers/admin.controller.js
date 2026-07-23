import argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import { generateToken } from "../../utils/generateJWT.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const fetchAdmin = await prisma.admin.findUnique({
      where: {
        adminEmail: email,
      },
    });
    if (fetchAdmin) {
      const verifyPassword = await argon2.verify(
        fetchAdmin.adminPassword,
        password,
      );

      const adminToken = generateToken(fetchAdmin.id);

      if (verifyPassword) {
        return res
          .cookie("adminToken", adminToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000,
          })
          .status(200)
          .json({
            message: "Admin Login Successfully",
            success: true,
          });
      }
    }

    if (!verifyPassword || !fetchAdmin) {
      return res.status(403).json({
        message: "Invalid credentials",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "Server error",
      success: false,
    });
  }
};

//******************************************** */

export const getLoginAdmin = async (req, res) => {
  try {
    const id = req.admin.id;
    const loggedInAdmin = await prisma.admin.findFirst({
      where: {
        id,
      },
      omit: {
        adminPassword: true,
        id: true,
      },
    });
    loggedInAdmin.role = "admin";

    console.log(loggedInAdmin);
    return res.status(200).json({
      message: "Admin authenticated successfully",
      loggedInAdmin,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || " Server Error",
      success: false,
    });
  }
};
//******************************************************* */
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const file = req.file;

    

    if (!file) {
      return res.status(400).json({
        message: "Image file is required.",
      });
    }

    const imageUrl = file.path;

   
    await prisma.category.create({
      data: {
        categoryName: name,
        categoryImage: {
          create: {
            secure_url: imageUrl,
            public_id:file.filename
          }
        }
      }
    })
    
   

    return res.status(201).json({
      message: "Category created successfully",
      data: {
        name,
        imageUrl,
      },
    });
  } catch (error) {
    // FIX: Changed 'e' to 'error'
    console.error("🚨 CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ******************************************************/

// ******************************************************************************************/

export const createMenuItem = async (req , res) => {
  try {
    const data = req.body;
    const images = req.files;
    await prisma.item.create({
      data: {
        itemName: data.itemName,
        categoryName: data.categoryName,
        itemPrice: Number.parseFloat(data.price, 2),
        itemDescription: data.shortDescription,
        badge: data.badge,
        itemImages: {
          create: images.map((image) => (
            {
              secure_url: image.path,
              public_id:image.filename
            }
          ))
           
          
        },
      },
      include: {
        itemImages:true
      }
    })

    return res.status(201).json({
      message: 'Item Created Successsfully ',
      succes: true 
    })
    
  } catch (error) {
    console.error("🚨 CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}