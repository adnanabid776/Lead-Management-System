// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import LeadList from "./Pages/Leads/LeadList";
import AddLead from "./Pages/Leads/AddLead";
import LeadDetails from "./Pages/Leads/LeadDetails";
import UserList from "./Pages/Users/UserList";
import AddUser from "./Pages/Users/AddUser";
import AppointmentList from "./Pages/Appointments/AppointmentList";
import AddAppointment from "./Pages/Appointments/AddAppointment";
import Sidebar from "./Components/SideBar";
import Header from "./Components/Header";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectRoute";
import Navigate from "./Components/Navigate";
import Footer from "./Components/Footer";
import Upload from "./Pages/Upload/Upload";
import {ToastContainer, toast} from 'react-toastify'

function Layout({ children, menu, setMenu }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar menu={menu} setMenu={setMenu} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          max-sm:overflow-hidden`}
      >
        <Header menu={menu} setMenu={setMenu} />
        {/* <div className=" bg-linear-to-r  to-blue-500">
          <Navigate/>
        </div> */}
        <main className="p-6 flex-1 ">
          <Navigate />
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  return (
    <AuthProvider>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout menu={menu} setMenu={setMenu}>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout menu={menu} setMenu={setMenu}>
                  <LeadList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/add"
            element={
              <ProtectedRoute>
                <Layout menu={menu} setMenu={setMenu}>
                  <AddLead />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute>
                <Layout menu={menu} setMenu={setMenu}>
                  <LeadDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Layout menu={menu} setMenu={setMenu}>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/add"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Layout menu={menu} setMenu={setMenu}>
                  <AddUser />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute roles={["manager", "admin", "agent"]}>
                <Layout menu={menu} setMenu={setMenu}>
                  <AppointmentList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/add"
            element={
              <ProtectedRoute roles={["agent"]}>
                <Layout menu={menu} setMenu={setMenu}>
                  <AddAppointment />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/edit/:id"
            element={
              <ProtectedRoute roles={["agent", "manager"]}>
                <Layout menu={menu} setMenu={setMenu}></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute roles={["manager", "admin"]}>
                <Layout menu={menu} setMenu={setMenu}>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <div className="p-8">
                You don't have permission to view this page.
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
