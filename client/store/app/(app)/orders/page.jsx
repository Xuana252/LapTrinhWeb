"use client";
import OrderSection from "@components/dashboardSection/OrderSection";
import { faBox, faSearch } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getAllOrder } from "@service/order";
import { useEffect, useState } from "react";

const OrderInfo = () => {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchOrders = async () => {
        setIsLoading(true)
        getAllOrder().then((res) => {
            setOrders(res)
        }).catch((err) => {
            console.log(err)
        })
        setTimeout(() => setIsLoading(false), 1000)
    }

    useEffect(() => {
        fetchOrders()
        console.log(orders)
    }, [])

    return (
        <div className="gap-4 flex flex-col">
            <div className="title">
                <FontAwesomeIcon icon={faBox} /> Orders
            </div>
            <div className="bg-surface bg-opacity-50 py-2 px-4 rounded-xl gap-4 panel-3">
                <h2 className="text-white font-bold text-lg">
                    {orders.length} orders
                </h2>
            </div>
            <OrderSection />
            {/* search */}
            <div className="panel-3">
                <div className="w-full rounded-full grow bg-primary-variant p-1 flex">
                    <input type="text" id="" className="w-full rounded-full px-2 bg-transparent text-on-primary placeholder:text-on-primary outline-none" placeholder="Search Order" />
                    <button className="text-xl text-surface rounded-full bg-on-surface h-full aspect-square flex items-center justify-center p-1">
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                </div>
            </div>
            {/* filter */}
            <div>
                
            </div>
        </div>
    )
}

export default OrderInfo

