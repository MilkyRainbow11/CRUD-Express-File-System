import { v4 as uuidv4 } from "uuid";
import express, { request } from "express";
import fs from "fs";

//File System

class DB {
  constructor() {
    this.DB = "./database/database.json";
  }

  find(coleccion) {
    const DB = JSON.parse(fs.readFileSync(this.DB));
    return DB[coleccion];
  }

  save(coleccion, data) {
    const DB = JSON.parse(fs.readFileSync(this.DB));
    data.id = uuidv4();
    DB[coleccion].push(data);
    fs.writeFileSync(this.DB, JSON.stringify(DB));
    return data;
  }
  update(coleccion, id, data) {
    const DB = JSON.parse(fs.readFileSync(this.DB));
    DB[coleccion].forEach((doc, index) => {
      if (doc.id === id) DB[coleccion][index] = data;
    });
    fs.writeFileSync(this.DB, JSON.stringify(DB));
    return data;
  }
  delete(coleccion, id) {
    const DB = JSON.parse(fs.readFileSync(this.DB));
    let data = null;
    DB[coleccion] = DB[coleccion].filter((doc) => {
      if (doc.id != id) return doc;
      data = doc;
    });
    fs.writeFileSync(this.DB, JSON.stringify(DB));
    return data;
  }
}

//Express

const db = new DB();

const app = express();
app.use(express.json());

app.get("/products", (_, response) => {
  response.send("Get All request was received successfully! Showing...");
  response.json(products);
  response.send("The products were showed succesfully");
});

app.get("/products/:id", (request, response) => {
  response.send("Get By ID request was received successfully! Showing...");
  const productFound = products.find(
    (product) => product.id === request.params.id
  );
  if (productFound == undefined)
    return response.send("Product could not be found or does not exist");
  response.json(productFound);
  response.send("The products were showed succesfully");
});

app.post("/products", (request, response) => {
  response.send("Post request was received successfully! Creating...");
  const newProduct = { ...request.body, id: uuidv4() };
  products.push(newProduct);
  response.send("The products were created succesfully");
});

app.put("/products", (request, response) => {
  response.send("Update request was received successfully! Updating...");
  const updatedProduct = request.body;
  const productFound = products.find(
    (product) => product.id === request.params.id
  );
  if (productFound == undefined)
    return response.send("Product could not be found or does not exist");
  products = products.map((product) => product.id === request.params.id)
    ? { ...product, ...updatedProduct }
    : product;
  response.send("The products were updated succesfully");
});

app.delete("/products", (request, response) => {
  response.send("Delete request was received successfully! Deleting...");
  const productFound = products.find(
    (product) => product.id === request.params.id
  );
  if (productFound == undefined)
    return response.send("Product could not be found or does not exist");
  products = products.filter((product) => product.id !== request.params.id);
  response.json(remainingProducts);
  response.send("The products were deleted succesfully");
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
