import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";

function App() {
  return (
        <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/chat"
          element={<ChatRoom />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;