const tokenExtractor = (request, response, next) => {
  const authHeader = request.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    request.token = authHeader.split(" ")[1];
  }
  next();
};

module.exports = tokenExtractor;
