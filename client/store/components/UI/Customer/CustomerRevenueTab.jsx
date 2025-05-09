"use client";
import Chart from "@components/UI/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { formatNumber, formattedPrice } from "@util/format";
import {
  faCalendar,
  faUserPlus,
  faUserClock,
  faCalendarDay,
  faAnglesUp,
  faAnglesDown,
  faAnglesRight,
  faTrophy,
  faUserAltSlash,
  faUsers,
  faBox,
  faBoxes,
  faBoxesPacking,
  faBook,
  faTags,
  faList,
  faBookReader,
  faWallet,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getProductsRevenue } from "@service/product";
import ProductCard from "@components/UI/Product/ProductCard";
import { getCustomerRevenue } from "@service/customer";

export default function CustomerRevenueTab({ id }) {
  const [data, setData] = useState(null);

  const fetchCustomerRevenue = async () => {
    getCustomerRevenue(id)
      .then((res) => {
        console.log(res);
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    id&&fetchCustomerRevenue();
  }, [id]);

  return (
    <div className="panel-3 flex flex-col gap-2">
      <div className="font-bold text-xl panel-3">
        <FontAwesomeIcon icon={faWallet} /> Customer Revenue
      </div>
      <div className="grid grid-cols-1 grow items-center gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type="Area"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Customer Revenue{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: { revenue: item.revenue },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faTags} /> Favorite Categories
            </span>

            <ul className="flex flex-wrap gap-2 ">
              {data?.categories?.map((ct) => (
                <span key={ct._id} className=" rounded border-current border-[1px] p-1 ">{ct.category_name}</span>
              ))}
            </ul>
          </div>
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faCalendar} /> This month revenue
              <span className="ml-2 text-sm font-bold ">
                {(() => {
                  const latest = data?.monthly?.at(-1)?.revenue ?? 0;
                  const previous = data?.monthly?.at(-2)?.revenue ?? 0;
                  const diff = latest - previous;
                  return (
                    <span
                      className={`inline-block text-xs ${
                        diff > 0
                          ? "text-green-400"
                          : diff < 0
                          ? "text-red-400"
                          : "text-yellow-400"
                      } p-1 rounded-lg bg-black `}
                    >
                      <FontAwesomeIcon
                        icon={
                          diff > 0
                            ? faAnglesUp
                            : diff < 0
                            ? faAnglesDown
                            : faAnglesRight
                        }
                      />{" "}
                      {formatNumber(Math.abs(diff))}
                    </span>
                  );
                })()}
              </span>
            </span>

            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.monthly?.at(-1).revenue ?? null) ?? (
                <NumberLoader />
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="panel-4 grow flex flex-col items-start">
        <span>
          <FontAwesomeIcon icon={faBook} /> Total revenue
        </span>
        <span className="font-mono text-2xl font-bold text-green-500">
          {formatNumber(data?.total ?? null) ?? <NumberLoader />}
        </span>
      </div>
    </div>
  );
}
