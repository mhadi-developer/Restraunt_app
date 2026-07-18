import jwt from "jsonwebtoken"

export const isAuthenticated = async (req, res , next) => {
    try {
        const token = req.cookies.token
      if (token) {
           
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.loginUser = decoded;
        req.loginUser.role = "user";
         next();
      }
        

        if (!token) {
          return res.status(404).json({
            message: "Unauthorized Access",
            success: false,
          });
         
            
         
        }
    } catch (error) {
        console.log(error);
        
        return res.status(401).json({
          message: "Invalid token",
        });
    }
    
}