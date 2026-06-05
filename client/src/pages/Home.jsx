import { useNavigate } from "react-router-dom";
import Login from "./Login";

function Home() {

    const navigate = useNavigate();

    const toLogin =() => {
    navigate("/login");
    }

    return(
        <div>
            <button
                onClick={toLogin}
            >
                Login
            </button>
        </div>
    )
};

export default Home;