export const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    res.writeHead(401, {
      "Content-Type": "application/json",
    });

    return res.end(
      JSON.stringify({
        message: "API key is required",
      }),
    );
  }

  if (apiKey !== "my-secret-key") {
    res.writeHead(403, {
      "Content-Type": "application/json",
    });

    return res.end(
      JSON.stringify({
        message: "Invalid API key",
      }),
    );
  }

  next();
};
