export const jsonResponse = (res, data, statusCode = 200) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  return res.end(JSON.stringify(data));
};
