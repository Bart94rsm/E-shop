import list from "../assets/list.svg";

function Dropdown({ openMenu }) {
  return <img className="list" src={list} alt="" onClick={openMenu} />;
}

export default Dropdown;
