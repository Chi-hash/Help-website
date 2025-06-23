import { useEffect, useState } from "react";

export function useDarkMode(defaultValue = false) {
  const [enabled, setEnabled] = useState(() => {
    const ls = localStorage.getItem("darkMode");
    return ls === null ? defaultValue : ls === "true";
  });

  useEffect(() => {
    if (enabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", enabled);
  }, [enabled]);

  return [enabled, setEnabled];
} 