import { useState } from "react";
import { Link } from "react-router-dom";

function Registration({ handleSubmit }) {
  const [formValue, setFormValue] = useState({
    nome: "",
    cognome: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const setValue = (e) => {
    setFormValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleForm = (e) => {
    e.preventDefault();
    handleSubmit(formValue);
  };

  return (
    <section id="registration-container">
      <form onSubmit={handleForm}>
        <h1>Compila i campi per registrarti</h1>
        <input
          type="text"
          name="nome"
          value={formValue.nome}
          onChange={setValue}
          placeholder="Nome"
        />
        <input
          type="text"
          name="cognome"
          value={formValue.cognome}
          onChange={setValue}
          placeholder="Cognome"
        />
        <input
          type="text"
          name="username"
          value={formValue.username}
          onChange={setValue}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={formValue.email}
          onChange={setValue}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formValue.password}
          onChange={setValue}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formValue.confirmPassword}
          onChange={setValue}
          placeholder="Conferma-Password"
        />
        <button type="submit">Invia</button>
        <p>
          Sei già registrato? <Link to="/login">Clicca qui</Link>
        </p>
      </form>
    </section>
  );
}

export default Registration;
