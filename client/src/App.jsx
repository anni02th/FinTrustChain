import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LoanRequestForm from "./pages/LoanRequestForm";
import LoanBrochures from "./pages/LoanBrochures";
import ContractViewer from "./pages/ContractViewer";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import './App.css'

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-loan" element={<ProtectedRoute><LoanRequestForm /></ProtectedRoute>} />
        <Route path="/brochures" element={<LoanBrochures />} />
        <Route path="/contracts/:id" element={<ProtectedRoute><ContractViewer /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      </Routes>

      <Footer />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
