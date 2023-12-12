import cart from "../assets/cart.svg";

function Cart({ cartQuantity, clickToCart }) {
  return (
    <div className="cart-container">
      <div className="img-span-container">
        <img className="cart" src={cart} alt="" />
        {cartQuantity > 0 && <span>{cartQuantity}</span>}
      </div>

      <button onClick={clickToCart}>Vai al carrello</button>
    </div>
  );
}

export default Cart;
