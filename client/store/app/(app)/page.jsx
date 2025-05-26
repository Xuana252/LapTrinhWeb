import CategorySection from "@components/dashboardSection/CategorySection";
import OrderSection from "@components/dashboardSection/OrderSection";
import ProductSection from "@components/dashboardSection/ProductSection";
import RevenueSection from "@components/dashboardSection/RevenueSection";
import UsersSection from "@components/dashboardSection/UsersSection";
import { faChartPie } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="title">
        <FontAwesomeIcon icon={faChartPie} /> Dashboard
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="grow basis-[100%] h-full">
          <RevenueSection />
        </div>
        <div className="grow basis-[500px] h-full">
          <UsersSection />
        </div>
        <div className="grow basis-[500px] h-full">
          <OrderSection />
        </div>
        <div className="grow basis-[100%] h-full">
          <ProductSection />
        </div>
        <div className="grow basis-[100%] h-full">
          <CategorySection />
        </div>
      </div>
    </div>
  );
}
