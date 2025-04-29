"use server";
import { cookies } from "next/headers";

export async function changeTheme(theme) {
  const currentTheme = await getStoredTheme();
  const cookieStore = await cookies(); 
  cookieStore.set(
    "ElectroDashboardTheme",
    currentTheme === "light" ? "dark" : "light"
  );
}

export async function getStoredTheme() {
  const cookieStore = await cookies(); 
  const storedTheme = cookieStore.get('ElectroDashboardTheme');
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
