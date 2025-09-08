// middleware/middleware.js

// Kiểm tra user đã đăng nhập chưa
export function isAuth(req, res, next) {
  if (!req.session.auth) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/auth/login");
  }
  next();
}

// Middleware tổng quát kiểm tra role
export function verifyRole(roles = []) {
  return (req, res, next) => {
    if (!req.session.authUser || !roles.includes(req.session.authUser.role)) {
      return res.redirect("/");
    }
    next();
  };
}

export const isAdmin = verifyRole(["administrator"]);
export const isWriter = verifyRole(["writer"]);
export const isEditor = verifyRole(["editor"]);
