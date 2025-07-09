import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result); // Data URL mil gaya
    reader.onerror = reject; // Error handle
    reader.readAsDataURL(file); // File ko base64 string me badlo
  });
}
