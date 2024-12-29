import jwt from "jsonwebtoken";
const JWT_SECRET = "secret";
export const middleware = {
  verifyRole: (roles) => {
    return (req, res, next) => {
      console.log(req.cookies.token);
      const token = req.cookies.token; // Get token from cookies
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Verify the token and decode it
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        // Attach the decoded role to the request object

        req.role = decoded.role;
        req.username = decoded.username;
        req.userId = decoded.userId;
        // Check if the user's role matches any of the required roles
        if (roles && !roles.includes(req.role)) {
          return res
            .status(403)
            .json({ message: "Access denied: insufficient role" });
        }

        // Proceed to the next middleware or route handler
        next();
      });
    };
  },
};
