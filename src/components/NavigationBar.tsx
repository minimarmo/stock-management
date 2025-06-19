import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState, type JSX } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { MdPointOfSale, MdStore } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  icon: JSX.Element;
  to: string;
};

const navItems: NavItem[] = [
  { label: "Stock", icon: <MdStore />, to: "/" },
  { label: "Add Product", icon: <FaCirclePlus />, to: "/add-stock" },
  { label: "Selling", icon: <MdPointOfSale />, to: "/sell-stock" },
];

export default function NavigationBar() {
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      bg="white"
      borderTop="1px solid #e2e8f0"
      px={2}
      py={2}
      boxShadow="md"
    >
      <Flex justify="space-around">
        {navItems.map((item) => {
          const isActive = value === item.to;
          return (
            <Box
              as={Link}
              to={item.to}
              key={item.to}
              textAlign="center"
              onClick={() => setValue(item.to)}
              color={isActive ? "#48BEE2" : "gray.400"}
            >
              <VStack spacing={0.5}>
                <Icon
                  as={item.icon.type}
                  boxSize={isActive ? 6 : 8}
                  color={isActive ? "#48BEE2" : "gray.400"}
                />
                {isActive && (
                  <Text fontSize="xs" fontWeight="semibold" color="#48BEE2">
                    {item.label}
                  </Text>
                )}
              </VStack>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
