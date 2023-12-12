import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Info from "./components/Info";
import { useState, useEffect } from "react";
import HiddenMenu from "./components/HiddenMenu";
import CartPage from "./components/CartPage";
import { Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import PrivateRoute from "./utils/PrivateRoute";
import { useLocation } from "react-router-dom";

const title = "Smart-Shop";

function App({ navigate }) {
  const [products, setProducts] = useState([]);
  const [menuState, setMenuState] = useState("close");
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0); // rappresenta il numero totale di articoli nel carrello
  const [cartUpdate, setCartUpdate] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

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
        setIsLoading(false); //
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
  }, [cartUpdate]);

  const handleCartChange = () => {
    setCartUpdate((prev) => prev + 1); // Incrementa cartUpdate per ri-triggerare il fetch
  };
  /*Utilizzare cartUpdate come dipendenza in un useEffect consente di effettuare un nuovo fetch
   dei dati del carrello ogni volta che una modifica viene apportata al carrello (ad esempio, 
    aggiunta, rimozione o modifica della quantità di un prodotto). Questo è utile per garantire che 
    l'applicazione sia sempre sincronizzata con l'ultimo stato del carrello sul server.
cartUpdate non tiene traccia dei dati specifici del carrello, ma piuttosto indica quando è 
necessario aggiornare questi dati.*/

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
        handleCartChange();
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
        {
          setCart([...data]);
          handleCartChange(); //aggiorno lo stato del carrello aggiornato
        }
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
    })
      .then((res) => res.json())
      .then((data) => {
        setCart([...data]);
        handleCartChange();
      });
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
      .then((data) => {
        setCart(data);
        handleCartChange();
      });
  };

  const handleSubmit = async (formValue) => {
    fetch("http://localhost:3000/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    })
      .then(async (res) => {
        if (!res.ok) {
          //se status > di 299
          const errorResponse = await res.json(); //converto il dato in ogg Javascript
          const errorMessage = errorResponse.errors
            .map((err) => err.msg)
            .join(`; `);
          throw errorMessage;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          alert("registrazione avvenuta con successo");
          navigate("/login");
        } else {
          console.log("errore nella registrazione");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleLogin = (loginValue) => {
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginValue),
      credentials: "include", // Questa opzione assicura che i cookie vengano inviati con la richiesta e salvati dal browser
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorResponse = await res.json();
          const errorMessage = errorResponse.errors;
          throw errorMessage;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          alert(data.msg);
          navigate("/cart");
        }
      })
      .catch((err) => {
        console.log("Errore durante la richiesta di login:", err);
        alert(err);
        setIsAuthenticated(false);
      });
  };

  const verifyToken = () => {
    setIsLoading(true);
    fetch("http://localhost:3000/api/verifyToken", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        console.log(res.status);
        //const data = await res.json();
        if (!res.ok) {
          //se non riceve token valido
          localStorage.removeItem("isAuthenticated");
          setIsAuthenticated(false);
          if (location.pathname === "/cart") {
            navigate("/login");
          }
          return;
        }
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        if (location.pathname !== "/cart") navigate("/cart");
      })
      .catch((error) => {
        console.error("Errore durante la verifica del token:", error);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      setIsAuthenticated(true);
    } else {
      verifyToken();
    }
  }, []); //quando aggiorno la pagina se sono autenticato rimango autenticato altrimenti riverifico il token
  //se token non valido reinderizza a login
  /*
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      verifyToken();
    }
  }, []);
*/
  const clickToCart = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      verifyToken();
    } else {
      navigate("/registration");
    }
  };

  return (
    //non uso Router perche gia avvolto App in Router in main.jsx
    <>
      <Header
        clickToCart={clickToCart}
        title={title}
        openMenu={openMenu}
        cartQuantity={cartQuantity}
      />
      <HiddenMenu menuState={menuState} closeMenu={closeMenu} />
      {isLoading ? (
        <div>Caricamento...</div> // Messaggio o indicatore di caricamento
      ) : (
        <main>
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
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CartPage
                    cart={cart}
                    handleMinus={handleMinus}
                    handlePlus={handlePlus}
                    handleRemove={handleRemove}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration"
              element={<Registration handleSubmit={handleSubmit} />}
            />
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />
          </Routes>
        </main>
      )}
    </>
  );
}

export default App;
