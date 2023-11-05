import Title from "./Title";
import Cart from "./Cart";
import Dropdown from "./Dropdown";
function Header({ title, openMenu, cartQuantity }) {
  return (
    <header>
      <Dropdown openMenu={openMenu} />

      <Title title={title} />
      <Cart cartQuantity={cartQuantity} />
    </header>
  );
}

export default Header;
