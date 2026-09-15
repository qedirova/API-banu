import http from "http";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  res.end("Hello world. This is my custom http server."); // otpravlayet response na client obratno
});

server.listen(PORT, () => console.log("Server has started!"));
