import http from "http";
import { loggerMiddleware } from "./middleware/logger.js";
import { checkApiKey } from "./middleware/checkApiKey.js";
import { jsonResponse } from "./utils/jsonResponse.js";
import { error } from "console";

const products = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
    category: "electronics",
  },
  {
    id: 2,
    name: "Phone",
    price: 800,
    category: "electronics",
  },
  {
    id: 3,
    name: "T-Shirt",
    price: 30,
    category: "clothes",
  },
  {
    id: 4,
    name: "Jacket",
    price: 100,
    category: "clothes",
  },
];

const server = http.createServer((req, res) => {
  loggerMiddleware(req, res, () => {
    checkApiKey(req, res, () => {
      if (req.method === "GET" && req.url === "/") {
        return res.end("hello world");
      }

      if (req.method === "GET" && req.url === "/products") {
        return jsonResponse(res, products);
      }

      if (req.method === "GET" && req.url.startsWith("/products/category/")) {
        const category = req.url.split("/")[3];

        const filteredProducts = products.filter(
          (product) => product.category === category,
        );

        if (filteredProducts.length === 0) {
          return jsonResponse(res, { error: "Product not found" }, 404);
        }

        return jsonResponse(res, filteredProducts);
      }

      if (req.method === "POST" && req.url === "/products/create") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          const data = JSON.parse(body);

          const newProduct = {
            id: products.length + 1,
            ...data,
          };

          products.push(newProduct);

          return jsonResponse(
            res,
            {
              message: "Product was successfully created",
              product: newProduct,
            },
            201,
          );
        });
        return;
      }

      if (req.method === "PATCH" && req.url.startsWith("/products/")) {
        const id = Number(req.url.split("/")[2]);

        const product = products.find((p) => p.id === id);

        if (!product)
          return jsonResponse(res, { error: "Product not found" }, 404);

        let body = "";

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          const data = JSON.parse(body);
          Object.assign(product, data);
          return jsonResponse(res, {
            message: "Product was successfully updated",
            product,
          });
        });

        return;
      }

      if (req.method === "DELETE" && req.url.startsWith("/products/")) {
        const id = Number(req.url.split("/")[2]);

        const index = products.findIndex((p) => id == p.id);

        if (index == -1) {
          return jsonResponse(res, { error: "Product not found" }, 404);
        }

        const deleted = products.splice(index, 1);
        return jsonResponse(res, {
          message: "Product was successfully deleted",
          product: deleted[0],
        });
      }

      return jsonResponse(res, { error: "This endpoint not found" }, 404);
    });
  });
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
