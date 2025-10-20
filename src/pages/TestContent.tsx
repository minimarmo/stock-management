import { Box, Button, Flex, Spacer, Stack, Text } from "@chakra-ui/react";

export default function TestCard() {
  return (
    <Box minH="80vh" w="400px" bg="gray.50" py={6}>
      {/* ไม่ใช้ Container ถ้าต้องการให้เต็ม 100% จริง */}
      <Stack spacing={4} px={4}>
        <Flex
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          boxShadow="md"
          bg="white"
          w="full"
        >
          <Box>
            <Text fontSize="sm" color="gray.500">
              QR: 1234567890
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              ตัวอย่างสินค้า
            </Text>
            <Text color="blue.600" fontWeight="semibold">
              ฿100.00
            </Text>
            <Text>จำนวน 5</Text>
            <Text fontSize="xs" color="gray.500">
              อัปเดตเมื่อ: 18 มิ.ย. 2025 22:00:00
            </Text>
          </Box>

          <Spacer />

          <Flex align="flex-start">
            <Button size="sm" variant="outline">
              แก้ไข
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );
}
