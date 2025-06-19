import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import AddStock from "../pages/AddStock";
import SellStock from "../pages/SellStock";
import StockList from "../pages/StockList";

export default function AppContent() {
  return (
    <Box pt="80px" pb="90px" px={4}>
      <Routes>
        <Route path="/" element={<StockList />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/sell-stock" element={<SellStock />} />
      </Routes>
    </Box>
  );
}
