import AddIcon from "@mui/icons-material/Add";
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
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

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
        onChange={(e, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction
          label="สต๊อก"
          value="/"
          icon={<StoreIcon />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="เพิ่ม"
          value="/add-stock"
          icon={<AddIcon />}
          component={Link}
          to="/add-stock"
        />
        <BottomNavigationAction
          label="ขาย"
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
        return "สต๊อกสินค้า";
      case "/add-stock":
        return "เพิ่มสินค้า";
      case "/sell-stock":
        return "ขายสินค้า";
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
    <Router>
      <HeaderBar />
      <AppContent />
      <NavigationBar />
    </Router>
  );
}

export default App;
