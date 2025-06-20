import { Box, Skeleton } from "@chakra-ui/react";

export default function CardSkeleton() {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" bg="white">
      <Skeleton height="16px" mb={2} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="16px" mb={1} width="60%" />
      <Skeleton height="16px" mb={1} width="40%" />
      <Skeleton height="14px" width="80%" />
    </Box>
  );
}
