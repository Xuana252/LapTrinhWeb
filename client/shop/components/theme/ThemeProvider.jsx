"use server";
import { cookies } from "next/headers";

export async function changeTheme(theme) {
  const currentTheme = await getStoredTheme();
  cookies().set(
    "ElectroHiveTheme",
    currentTheme === "light" ? "dark" : "light"
  );
}

export async function getStoredTheme() {
  const storedTheme = cookies().get("ElectroHiveTheme");
  return storedTheme ? storedTheme.value : "light";
}

export default async function ThemeProvider({ children }) {
  const theme = await getStoredTheme();

  return (
    <div className={`${theme}`} id="themeProvider">
      {children}
    </div>
  );
}
