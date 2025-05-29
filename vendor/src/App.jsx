// App.jsx
import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Dashboard, Navbar, SideBar } from "./scenes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Context from "./Context/Context";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from './Pages/Products';
import Orders from './Pages/Orders';
import Payments from './Pages/Payments';
import Feedbacks from './Pages/Feedbacks';
import Profile from './Pages/Profile';
import Message from './Pages/Message';
// import Payments from "./Pages/PaymentsManage";

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    <Router>
      <Context>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToggledContext.Provider value={values}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
                      <SideBar />
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <Navbar />
                        <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/payments" element={<Payments/>} />
                            <Route path="/feedbacks" element={<Feedbacks />} />
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/message" element={<Message/>}/>
                            {/* <Route path="/users" element={<Users />} /> */}
                          </Routes>
                        </Box>
                      </Box>
                    </Box>
                  </ProtectedRoute>
                } />
              </Routes>
            </ToggledContext.Provider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </Context>
    </Router>
  );
}

export default App;
