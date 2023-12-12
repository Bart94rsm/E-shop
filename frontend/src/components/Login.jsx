import { useState } from "react";

function Login({ handleLogin }) {
  const [loginValue, setLoginValue] = useState({
    email: "",
    password: "",
  });

  const setValue = (e) => {
    setLoginValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleForm = (e) => {
    e.preventDefault();
    handleLogin(loginValue);
  };
  return (
    <section id="login-container">
      <form onSubmit={handleForm}>
        <h1>Effettua il Login</h1>
        <input
          type="text"
          name="email"
          value={loginValue.email}
          onChange={setValue}
          placeholder="Email"
        />

        <input
          type="password"
          name="password"
          value={loginValue.password}
          onChange={setValue}
          placeholder="Password"
        />

        <button type="submit">Invia</button>
      </form>
    </section>
  );
}

export default Login;
