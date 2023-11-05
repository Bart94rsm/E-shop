import Header from "./components/Header";
import ProductList from "./components/ProductList";
import immagini from "./utils/images";
import Info from "./components/Info";
import { useState, useEffect } from "react";
import HiddenMenu from "./components/HiddenMenu";
import CartPage from "./components/CartPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const title = "Smart-Shop";

function App() {
  const [products, setProducts] = useState([]);
  const [menuState, setMenuState] = useState("close");
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);

  const openMenu = () => {
    setMenuState("open");
  };
  const closeMenu = () => {
    setMenuState("close");
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        const quantity = data.reduce((acc, item) => acc + item.quantity, 0);
        const totalItems = data.length;
        const totalQuantity = totalItems + (quantity - totalItems);
        setCartQuantity(totalQuantity);
      })
      .catch((err) => console.log(err));
  });

  const addToCart = (productId, quantity) => {
    fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
      })
      .catch((err) => console.log(err));
  };

  const handlePlus = (productId, quantity) => {
    //approccio passando direttamente solo due proprietà
    const updatedQuantity = quantity + 1;

    fetch(`http://localhost:3000/api/cart/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity: updatedQuantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
      });
  };

  const handleMinus = (item) => {
    //approccio passando l'intero oggetto e inviando solo l'id e quantity al backend
    const updatedQuantity = item.quantity - 1;
    fetch(`http://localhost:3000/api/cart/remove/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ productId: item._id, quantity: updatedQuantity }),
    });
    setCart(data);
  };

  const handleRemove = (item) => {
    fetch(`http://localhost:3000/api/cart/delete/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      //body non serve per richieste delete
    })
      .then((res) => res.json())
      .then((data) => setCart(data));
  };

  return (
    <Router>
      <Header
        title={title}
        menuState={menuState}
        openMenu={openMenu}
        cartQuantity={cartQuantity}
      />
      <HiddenMenu menuState={menuState} closeMenu={closeMenu} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Info />
              <ProductList info={products} addToCart={addToCart} />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              handleMinus={handleMinus}
              handlePlus={handlePlus}
              handleRemove={handleRemove}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
