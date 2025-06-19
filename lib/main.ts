import toast from "react-hot-toast";
import { convertAddressToName } from "./convertAddress";

const copyKey = (key: string) => {
  navigator.clipboard.writeText(key);
  toast.success("Copied to clipboard");
};
const showKey = (key: string) => {
  const name = convertAddressToName(key);
  if (name != key) return name;
  else return key.slice(0, 2) + "***" + key.slice(-4);
};
const showStatusKey = (key: string) => {
  const name = convertAddressToName(key);
  if (name != key) return name;
  else return key.slice(0, 4) + "***" + key.slice(-3);
};
const showDashKey = (key: string) => {
  return key.slice(0, 2) + "***" + key.slice(-4);
};
const showTaoNumber = (number: number) => {
  const taoNumber = number / 1e9;
  return parseFloat(taoNumber.toString()).toFixed(2);
};
const showNumber = (number: number, unit: number) => {
  if (number) return parseFloat(number.toString()).toFixed(unit);
  else return "0";
};

const showTimestampToDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getS2kUrl = (aa: number): string => {
  const str = aa.toString();

  if (aa < 10) {
    return `0s2k${str}`;
  } else if (aa < 100) {
    return `${str[0]}s2k${str[1]}`;
  } else {
    return `${str[0]}${str[1]}s2k${str[2]}`;
  }
};

const decodeS2kUrl = (s2kStr: string): number => {
  const [part1, part2] = s2kStr.split("s2k");

  if (!part1 || !part2) throw new Error("Invalid s2k format");

  if (part1 === "0" && part2.length === 1) {
    // e.g., "0s2k3" → 3
    return parseInt(part2, 10);
  } else if (part1.length === 1 && part2.length === 1) {
    // e.g., "4s2k2" → 42
    return parseInt(part1 + part2, 10);
  } else if (part1.length === 2 && part2.length === 1) {
    // e.g., "12s2k8" → 128
    return parseInt(part1 + part2, 10);
  } else {
    throw new Error("Unsupported pattern");
  }
};

export {
  copyKey,
  showKey,
  showStatusKey,
  showTaoNumber,
  showNumber,
  showTimestampToDateTime,
  showDashKey,
  getS2kUrl,
  decodeS2kUrl,
};
