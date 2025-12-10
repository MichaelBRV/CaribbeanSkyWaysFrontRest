// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout principal (Navbar + Outlet)
import Layout from "../components/layout/Layout";

// Público
import Home from "../pages/Home";
import FlightResults from "../pages/FlightResult";
import FlightDetail from "../pages/FlightDetail";
import Checkout from "../pages/Checkout";
import Confirmation from "../pages/Confirmation";
import MyFlightDetail from "../pages/MyFlightDetail";

// Nuevos
import SeatSelection from "../pages/SeatSelection";
import PaymentCard from "../pages/PaymentCard";

// Usuario
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/user/Profile";
import MyReservations from "../pages/user/MyReservations";
import PaymentHistory from "../pages/user/PaymentHistory";

// Admin
import AdminPanel from "../pages/admin/AdminPanel";
import ManageFlights from "../pages/admin/ManageFlights";
import ManageReservations from "../pages/admin/ManageReservations";
import ManageUsers from "../pages/admin/ManageUsers";
import ManagePromotions from "../pages/admin/ManagePromotions";

// Rutas protegidas
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter({ openAuthModal }) {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout recibe la función para abrir el modal */}
        <Route path="/" element={<Layout openAuthModal={openAuthModal} />}>

          {/* --------------------- */}
          {/* PÚBLICO */}
          {/* --------------------- */}
          <Route index element={<Home />} />
          <Route path="results" element={<FlightResults />} />
          <Route path="flight/:id" element={<FlightDetail />} />

          {/* --------------------- */}
          {/* RUTAS PROTEGIDAS */}
          {/* --------------------- */}

          <Route
            path="checkout"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="select-seat"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <SeatSelection />
              </ProtectedRoute>
            }
          />

          <Route
            path="payment-card"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <PaymentCard />
              </ProtectedRoute>
            }
          />

          <Route
            path="confirmation"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <Confirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/profile"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/reservations"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/payments"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-flight"
            element={
              <ProtectedRoute openAuthModal={openAuthModal}>
                <MyFlightDetail />
              </ProtectedRoute>
            }
          />

          {/* --------------------- */}
          {/* ADMIN */}
          {/* --------------------- */}

          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          <Route
            path="admin/flights"
            element={
              <AdminRoute>
                <ManageFlights />
              </AdminRoute>
            }
          />

          <Route
            path="admin/reservations"
            element={
              <AdminRoute>
                <ManageReservations />
              </AdminRoute>
            }
          />

          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />

          <Route
            path="admin/promotions"
            element={
              <AdminRoute>
                <ManagePromotions />
              </AdminRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
