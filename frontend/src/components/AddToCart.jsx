import { useState } from "react";

function AddToCart({ addToCart, productId }) {
  const [quantity, setQuantity] = useState(0);
  const handleAddToCart = () => {
    const validQuantity = Number(quantity) > 0 ? Number(quantity) : -1; //trasformo la stringa dell input in numero
    if (validQuantity < 0) {
      return alert("Inserisci una quantità valida");
    }
    addToCart(productId, validQuantity);
  };
  return (
    <div className="addtocart-container">
      <input
        type="number"
        placeholder="0"
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleAddToCart}>Aggiungi al carrello</button>
    </div>
  );
}
export default AddToCart;
