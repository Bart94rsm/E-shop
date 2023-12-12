import { useNavigate } from "react-router-dom";
import App from "../App";

function NavigateWrapper() {
  const navigate = useNavigate();
  return <App navigate={navigate} />;
}

export default NavigateWrapper;
