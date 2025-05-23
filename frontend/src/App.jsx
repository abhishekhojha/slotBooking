import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
function AppRoutes() {
  const { user } = useAuth();
  console.log(user?.role == "admin");
  
  return (
    <Routes>
      <Route
        path="/"
        element={user?.role == "admin" ? <AdminDashboard /> : <Dashboard />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
