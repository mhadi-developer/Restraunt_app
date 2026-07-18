import argon2 from "argon2"
import prisma from "../../utils/prismaClient.js"
import { log } from "console";


export const loginAdmin = async (req , res) => {
    try {
        const { email, password } = req.body;

    
        const fetchAdmin = await prisma.admin.findUnique({
            where: {
                adminEmail: email
            }
        });
        console.log({fetchAdmin})
    
    const verifyPassword = await argon2.verify( fetchAdmin.adminPassword, password);
    
    if (verifyPassword && fetchAdmin) {
        return res.status(200).json({
            message: 'Admin Login Successfully',
            success: true
        })
    };
    if (!verifyPassword || !fetchAdmin) {
        return res.status(403).json({
            message: 'Invalid credentials',
            success: false
        });
    }
} catch (error) {
    console.log(error);
    return res.status(500).json({
        message: error?.message || 'Server error',
        success: false
    })
}    
}