import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/auth/login",
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

      navigate("/chat");

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