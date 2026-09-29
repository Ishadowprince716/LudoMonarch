import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import AIGamePage from "./pages/AIGamePage";

function Protected({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Protected><LobbyPage /></Protected>} />
          <Route path="/join" element={<Protected><LobbyPage /></Protected>} />
          <Route path="/game/:roomId" element={<Protected><GamePage /></Protected>} />
          <Route path="/ai" element={<AIGamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}