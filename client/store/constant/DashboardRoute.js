import {
    faGear,
    faUser,
    faUserGear,
    faKey,
    faUserLock,
    faChartSimple,
    faChartBar,
    faChartDiagram,
    faChartPie,
    faUserGroup,
    faBoxOpen,
    faBox,
    faMemory,
    faIdBadge,
    faTruck,
    faMessage,
    faTag,
  } from "@fortawesome/free-solid-svg-icons";
  
  export const DashboardRoutes = [
    {
      section: "Dashboard",
      items: [
        {
          path: "/",
          name: "Dashboard",
          icon: faChartPie,
          description: "System Dashboard",
          subPath:[]
        },
      ],
    },
    {
      section: "Users",
      items: [
        {
          path: "/users",
          name: "System Users ",
          icon: faUserGroup,
          description: "view system users",
          subPath:[]
        },
      ],
    },
    {
      section: "Product",
      items: [
        {
          path: "/product/products",
          name: "Your Products",
          icon: faBox,
          description: "View your products",
          subPath:[]
        },
        {
          path: "/product/categories",
          name: "Product Categories",
          icon: faTag,
          description: "View your product categories",
          subPath:[]
        },
      ],
    },
    {
      section: "Orders",
      items: [
        {
          path: "/orders",
          name: "Customer Orders",
          icon: faTruck,
          description: "Manage your orders",
          subPath:[]
        },
      ],
    },
    {
      section: "About Us",
      items: [
        {
          path: "/about",
          name: "Your Team",
          icon: faIdBadge,
          description: "See your team details",
          subPath:[]
        },
      ],
    },
    {
      section: "Customer Support",
      items: [
        {
          path: "/about",
          name: "Customer Support",
          icon: faMessage,
          description: "See your team details",
          subPath:[]
        },
      ],
    },
  ];
  