import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx"

function App() {
  return (
        <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/chat"
          element={
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
