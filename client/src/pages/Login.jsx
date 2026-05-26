import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      // Store token
      localStorage.setItem(
        "token",
        res.data.token
      );
      console.log(localStorage.getItem("token"));

    } catch (error) {

      console.error(error.response.data);

    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={submitHandler}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;