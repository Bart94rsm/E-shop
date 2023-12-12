import cart from "../assets/cart.svg";
import { Link } from "react-router-dom";

function Cart({ cartQuantity }) {
  return (
    <div className="cart-container">
      <div className="img-span-container">
        <img className="cart" src={cart} alt="" />
        {cartQuantity > 0 && <span>{cartQuantity}</span>}
      </div>
      <Link to="/cart">
        <button>Vai al carrello</button>
      </Link>
    </div>
  );
}

export default Cart;
