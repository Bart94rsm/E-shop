import Title from "./Title";
import Cart from "./Cart";
import Dropdown from "./Dropdown";
function Header({ title, openMenu, cartQuantity, clickToCart }) {
  return (
    <header>
      <Dropdown openMenu={openMenu} />

      <Title title={title} />
      <Cart cartQuantity={cartQuantity} clickToCart={clickToCart} />
    </header>
  );
}

export default Header;
