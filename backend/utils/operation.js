import { MongoClient } from "mongodb";
import db from "./db.js";
import productsList from "./productsList.js";
import { ObjectId } from "mongodb";
import express from "express";
import bcrypt from "bcrypt";

const operation = express();

operation.use(express.urlencoded({ extended: true }));

const initDb = async () => {
  const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");
  await mongoClient.connect();
  console.log("connessione al database avvenuta");
  db.shop = mongoClient.db("shop");
  db.products = db.shop.collection("products");
  const existingDoc = await db.products.countDocuments();
  if (existingDoc === 0) {
    await db.products.insertMany(productsList);
  }
};

const readProducts = async () => {
  const list = await db.products.find().toArray();
  return list;
};

const initCart = async () => {
  db.cart = db.shop.collection("cart"); //finche non inserisco doc non viene creato
};

const readCart = async () => {
  const cartItems = await db.cart.find().toArray();
  return cartItems;
};

const addToCart = async (req) => {
  const { productId, quantity } = req.body;
  const product = await db.products.findOne({ _id: new ObjectId(productId) }); //cerco prodotto nel database e lo salvo in product
  const existingCartItem = await db.cart.findOne({
    _id: new ObjectId(productId),
  });

  if (existingCartItem) {
    //se trovato mi aggiorna solo la proprietà quantità con incrementa
    await db.cart.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { quantity: quantity } }
    );
  } else {
    const cartItem = { ...product, quantity }; // creo oggetto con proprietà del prodotto nel database + la quantità
    await db.cart.insertOne(cartItem);
  }
};

const addQuantityCart = async (req) => {
  const { productId, quantity } = req.body;
  console.log(req.body);
  const product = await db.cart.findOne({ _id: new ObjectId(productId) });
  let result;
  result = await db.cart.updateOne(
    { _id: new ObjectId(productId) },
    { $inc: { quantity: 1 } }
  );
};

const removeQuantityCart = async (req) => {
  const { productId, quantity } = req.body;
  console.log(req.body);
  const product = await db.cart.findOne({ _id: new ObjectId(productId) });
  let result;
  if (quantity === 0) {
    return (result = await db.cart.deleteOne({ _id: new ObjectId(productId) }));
  }
  result = await db.cart.updateOne(
    { _id: new ObjectId(productId) },
    { $inc: { quantity: -1 } }
  );
};

const removeCartItem = async (req) => {
  //con delete devo usare req.params non passando l'id nel corpo della richiesta in fetch, ma nel url
  const { productId } = req.params;
  console.log(req.params);
  const product = await db.cart.findOne({ _id: new ObjectId(productId) });
  const result = await db.cart.deleteOne({ _id: new ObjectId(productId) });
  return result;
};

const initUsers = async () => {
  db.users = await db.shop.collection("users");
};

const insertUserReg = async (req) => {
  const { nome, cognome, username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = { nome, cognome, username, email, password: hash };
  const userInserted = await db.users.insertOne(user);
  return userInserted;
};

export {
  initDb,
  readProducts,
  initCart,
  readCart,
  addToCart,
  addQuantityCart,
  removeQuantityCart,
  removeCartItem,
  initUsers,
  insertUserReg,
};
