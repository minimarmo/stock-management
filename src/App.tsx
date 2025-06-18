import AddCircleIcon from "@mui/icons-material/AddCircle";
import SellIcon from "@mui/icons-material/PointOfSale";
import StoreIcon from "@mui/icons-material/Store";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";

import AddStock from "./pages/AddStock";
import SellStock from "./pages/SellStock";
import StockList from "./pages/StockList";

function NavigationBar() {
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction
          label="Stock"
          value="/"
          icon={<StoreIcon />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Add Product"
          value="/add-stock"
          icon={<AddCircleIcon />}
          component={Link}
          to="/add-stock"
        />
        <BottomNavigationAction
          label="Selling"
          value="/sell-stock"
          icon={<SellIcon />}
          component={Link}
          to="/sell-stock"
        />
      </BottomNavigation>
    </Paper>
  );
}

function HeaderBar() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Stock";
      case "/add-stock":
        return "Add Product";
      case "/sell-stock":
        return "Selling";
      default:
        return "ระบบจัดการสต๊อก";
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div">
          {getTitle()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function AppContent() {
  return (
    <Box sx={{ pt: 8, pb: 8 }}>
      <Routes>
        <Route path="/" element={<StockList />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/sell-stock" element={<SellStock />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <HashRouter>
      <HeaderBar />
      <AppContent />
      <NavigationBar />
    </HashRouter>
  );
}

// ใช้ HashRouter แทน BrowserRouter
// เพราะ GitHub Pages ไม่รองรับ route แบบ history API
// HashRouter ใช้ #/path ซึ่งทำให้ routing ทำงานฝั่ง client ได้ถูกต้อง

export default App;
