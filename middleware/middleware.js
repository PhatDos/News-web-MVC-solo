export function isAuth(req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
}

export function isAdmin(req, res, next) {
  if (!req.session.authUser || req.session.authUser.role !== "administrator") {
    return res.redirect("/");
  }
  next();
}

export function isWriter(req, res, next) {
  if (!req.session.authUser || req.session.authUser.role !== "writer") {
    return res.redirect("/");
  }
  next();
}

export function isEditor(req, res, next) {
  if (!req.session.authUser || req.session.authUser.role !== "editor") {
    return res.redirect("/");
  }
  next();
}
