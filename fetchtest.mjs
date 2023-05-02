import axios from "axios";

const getProducts = async () => {
  const respuesta = await axios.get("http://localhost:3000/products");

  console.log("getProducts: ", respuesta.data);
};

getProducts();
