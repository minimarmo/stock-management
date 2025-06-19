import { Box, Flex, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export default function HeaderBar() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Stock";
      case "/add-stock":
        return "Add Product";
      case "/sell-stock":
        return "Selling";
      case "/report":
        return "Report";
      default:
        return "Stock Management";
    }
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      height="64px"
      bg="#74C4E9"
      boxShadow="md"
      zIndex={1000}
    >
      <Flex height="100%" align="center" justify="center" px={4}>
        <Text fontSize="lg" fontWeight="bold" color="black">
          {getTitle()}
        </Text>
      </Flex>
    </Box>
  );
}
