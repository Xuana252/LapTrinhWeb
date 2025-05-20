import OrderItem from "../OrderItem";
import ProductCard from "../Product/ProductCard";

const OrderItemTab = ({orderItems, isLoading}) => {
  return (
    <div className="flex flex-col gap-2 w-full panel-3">
      <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
        Order Items
      </div>
      <div className="space-y-3">
        {isLoading
          ? Array.from({length:3}).map((_, index) => (
              <OrderItem loading={isLoading} key={index} />
            ))
          : orderItems.map((item,index) => <OrderItem orderItem={item} key={index}/>)}
      </div>
    </div>
  );
};

export default OrderItemTab;
