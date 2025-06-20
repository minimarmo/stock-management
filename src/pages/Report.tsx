import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useEffect, useState } from "react";
import InReport from "../components/reports/InReport";
import LogReport from "../components/reports/LogReport";
import OutReport from "../components/reports/OutReport";
import { getAllProductLogs } from "../services/stockService";
import type { ProductLog } from "../types/product-logs";

dayjs.locale("th");

export default function Report() {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"in" | "out" | "log">("in");

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month(); // 0-11
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonthNum, setSelectedMonthNum] = useState(currentMonth);

  const selectedMonth = `${selectedYear}-${String(
    selectedMonthNum + 1
  ).padStart(2, "0")}`;

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // ปีปัจจุบัน + สองปีย้อนหลัง
  const availableYears = Array.from({ length: 3 }, (_, i) => currentYear - i);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const logData = await getAllProductLogs(selectedMonth);
        const sorted = logData.sort(
          (a, b) =>
            dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
        );
        setLogs(sorted);
      } catch (err) {
        console.error("Error fetching logs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedMonth]);

  return (
    <Box p={4} minH="90vh" w="calc(100vw - 32px)">
      <Flex gap={4} mb={6} align="center" flexWrap="wrap">
        <Flex w="full" gap={2}>
          <Select
            w="full"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                ปี {year}
              </option>
            ))}
          </Select>

          <Select
            w="full"
            value={selectedMonthNum}
            onChange={(e) => setSelectedMonthNum(Number(e.target.value))}
          >
            {thaiMonths.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </Select>
        </Flex>

        <RadioGroup
          w="full"
          onChange={(val: "in" | "out" | "log") => setViewMode(val)}
          value={viewMode}
        >
          <Flex justify="space-around">
            <Radio value="in">IN</Radio>
            <Radio value="out">OUT</Radio>
            <Radio value="log">All Logs</Radio>
          </Flex>
        </RadioGroup>
      </Flex>

      {loading ? (
        <Stack spacing={3}>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <>
          {viewMode === "in" && <InReport logs={logs} />}
          {viewMode === "out" && <OutReport logs={logs} />}
          {viewMode === "log" && <LogReport logs={logs} />}
        </>
      )}
    </Box>
  );
}
