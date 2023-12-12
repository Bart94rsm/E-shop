import express from "express";
import {
  readProducts,
  readCart,
  addToCart,
  addQuantityCart,
  removeQuantityCart,
  removeCartItem,
} from "../utils/operation.js";
import db from "../utils/db.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express();

router.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

router.get("/api/products", async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    res.status(500).send("Errore durante il recupero dei prodotti");
  }
});

router.get("/api/cart", async (req, res) => {
  try {
    const cart = await readCart();
    res.json(cart);
  } catch (err) {
    res.status(500).send("Errore durante il recupero del carrello");
  }
});

router.post("/api/cart", async (req, res) => {
  const addedToCart = await addToCart(req);
  res.status(201).json(addedToCart);
});

router.put("/api/cart/add", async (req, res) => {
  const updatedQuantity = await addQuantityCart(req);
  const updatedCart = await db.cart.find().toArray();
  res.status(201).json(updatedCart);
});

router.put("/api/cart/remove/:productId", async (req, res) => {
  const updatedQuantity = await removeQuantityCart(req);
  const updatedCart = await db.cart.find().toArray();
  res.status(201).json(updatedCart);
});

router.delete("/api/cart/delete/:productId", async (req, res) => {
  //:productId deve combaciare con productId di req.body
  await removeCartItem(req);
  const updatedCart = await db.cart.find().toArray(); //restituisco carrello aggiornato
  res.status(201).json(updatedCart);
});

router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

export default router;
