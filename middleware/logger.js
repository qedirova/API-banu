export const loggerMiddleware = (req, res, next) => {
  const now = new Date();

  const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  console.log(`[${currentTime}] ${req.method} ${req.url}`);

  next();
};
