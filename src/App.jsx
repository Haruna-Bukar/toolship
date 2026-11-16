import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ToolPage from "./pages/ToolPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Everything inside here needs a signed-in user */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tools/:toolName" element={<ToolPage />} />
      </Route>
    </Routes>
  );
}