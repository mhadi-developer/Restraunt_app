import jwt from "jsonwebtoken"

export const isAdminAuthenticated = (req , res , next) => {

    try {
        const adminToken = req.cookies.adminToken;
        if (adminToken) {
          const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
          req.admin = decoded;
          req.admin.role = "admin";
          next();
        }
        if (!adminToken) {
          return res.status(403).json({
            message: "Unauthorized Access",
            success: false,
          });
        }
    } catch (error) {
        console.log(error);
        
        rws.status(500).json({
            message:error.message || "Server error",
        })
    }
    
}