const jwt = require("jsonwebtoken");

const fetchData = (req, res, next) => {
  const token = req.header("authToken");
  if (!token) {
    res.status(401).send({ error: "server error, Authentication failed" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_secret);
    req.user = data.user;
  } catch (e) {
    res.status(401).send({ error: "server error, Authentication failed 2" });
  }
  next();
};
module.exports = fetchData;
