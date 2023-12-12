import express from "express";
import {
  readProducts,
  readCart,
  addToCart,
  addQuantityCart,
  removeQuantityCart,
  removeCartItem,
  insertUserReg,
} from "../utils/operation.js";
import db from "../utils/db.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import CookieParser from "cookie-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

const router = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

router.use(cookieParser());

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
  await addToCart(req);
  const updatedCart = await db.cart.find().toArray();
  res.status(201).json(updatedCart);
});

router.put("/api/cart/add", async (req, res) => {
  await addQuantityCart(req);
  const updatedCart = await db.cart.find().toArray();
  res.status(201).json(updatedCart);
});

router.put("/api/cart/remove/:productId", async (req, res) => {
  await removeQuantityCart(req);
  const updatedCart = await db.cart.find().toArray();
  res.status(201).json(updatedCart);
});

router.delete("/api/cart/delete/:productId", async (req, res) => {
  //:productId deve combaciare con productId di req.body
  await removeCartItem(req);
  const updatedCart = await db.cart.find().toArray(); //restituisco carrello aggiornato
  res.status(201).json(updatedCart);
});

router.post("/api/registration", async (req, res) => {
  const { nome, cognome, username, email, password, confirmPassword } =
    req.body;
  let errors = [];
  const existingUser = await db.users.findOne({ email });
  if (existingUser) {
    errors.push({ msg: "Utente già registrato" });
  }
  if (
    !validator.isAlpha(nome) ||
    !validator.isLength(nome, { min: 4, max: 15 })
  ) {
    errors.push({
      msg: "Nome non valido o lunghezza non adeguata (min:4 e max:15)",
    });
  }
  if (
    !validator.isAlpha(cognome) ||
    !validator.isLength(cognome, { min: 4, max: 15 })
  ) {
    errors.push({
      msg: "Cognome non valido o lunghezza non adeguata (min:4 e max:15)",
    });
  }
  if (
    !validator.isAlpha(username) ||
    !validator.isLength(username, { min: 4, max: 10 })
  ) {
    errors.push({
      msg: "Username non valido o lunghezza non adeguata (min:4 e max:10)",
    });
  }
  if (!validator.isEmail(email)) {
    errors.push({
      msg: "Email non valida",
    });
  }
  if (!validator.isStrongPassword(password)) {
    errors.push({
      msg: "Password non sicura: inserisci una maiuscola, un carattere speciale, un numero ed un minimo di 8 caratteri",
    });
  }
  if (password !== confirmPassword) {
    errors.push({
      msg: "La conferma password non combacia con la password inserita",
    });
  }
  if (errors.length > 0) {
    res.status(400).json({ errors }); //creo oggetto con array errors che contiene i messaggi errore
  } else {
    const user = await insertUserReg(req);
    res.status(201).json(user);
  }
});

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  let errors = [];

  const user = await db.users.findOne({ email });
  if (user) {
    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (passwordCheck) {
      const payload = {
        sub: user._id.toString(),
        isLogged: true,
      };
      const token = jwt.sign(payload, "chiave", { expiresIn: 60 });
      res.cookie("tokenJWT", token, {
        maxAge: 60 * 1000,
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ msg: "Login riuscito" });
    } else {
      errors.push({ msg: "Username e password non validi" });
    }
  } else {
    errors.push({ msg: "Utente non trovato" });
  }
  if (errors.length > 0) {
    res.status(400).json({ errors });
  }
});

router.get("/api/verifyToken", async (req, res) => {
  const token = req.cookies.tokenJWT; //seleziono il cookie
  if (!token) {
    return res.status(400).json({ msg: "Nessun token fornito" });
  }
  jwt.verify(token, "chiave", (err) => {
    if (err) {
      return res
        .status(401)
        .json({ msg: "Sessione scaduta, rieffettua il login" });
    }
    res.status(200).json({ msg: "token valido" });
  });
});

router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

export default router;
