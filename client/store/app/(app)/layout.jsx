import "@styles/globals.css";
import { Toaster, toast } from "sonner";
import { config, icon } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import ThemeProvider from "@components/theme/ThemeProvider";
import SideBar from "@components/UI/Layout/SideBar";
import { DashboardRoutes } from "@constant/DashboardRoute";
config.autoAddCss = false;

export const metadata = {
  title: "Electro Dashboard",
  description: "Generated by create next app",
  icons: {
    icon: process.env.NEXT_PUBLIC_APP_LOGO, // Ensure this path is correct
  },
};

export default function RootLayout({ children }) {
  return <SideBar menu={DashboardRoutes}>{children}</SideBar>;
}
