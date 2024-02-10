// Middleware implementation taken from https://www.youtube.com/watch?v=dX_LteE0NFM

const jwt = require("jsonwebtoken");

//middleware func takes token out of cookie and verifies it
function cookieJwtAuth(req, res, next) {
  const token = req.cookies.token;
  try {
    const customer = jwt.verify(token, process.env.SECRET_CUSTOMER_KEY);
    req.customer = customer;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/customer/login");
  }
}

module.exports = cookieJwtAuth;
