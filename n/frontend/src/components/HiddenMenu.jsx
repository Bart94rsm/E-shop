import close from "../assets/close.svg";
import { Link } from "react-router-dom";

function HiddenMenu({ menuState, closeMenu }) {
  return (
    <div className={`background ${menuState}`}>
      <nav>
        <ul>
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <a href="">Services</a>
          </li>
          <li>
            <a href="">Contacts</a>
          </li>
        </ul>
      </nav>
      <img className="closer-svg" src={close} alt="" onClick={closeMenu} />
    </div>
  );
}

export default HiddenMenu;
