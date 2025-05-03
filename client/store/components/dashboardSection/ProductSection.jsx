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
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getProductsRevenue } from "@service/product";
import ProductCard from "@components/UI/Product/ProductCard";

export default function ProductSection() {
  const [data, setData] = useState(null);

  const fetchProductData = async () => {
    getProductsRevenue()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="panel-3 flex flex-col gap-2">
      <div className="font-bold text-xl panel-3">
        <FontAwesomeIcon icon={faBox} /> Products
      </div>
      <div className="grid grid-cols-1 grow items-center gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type="Area"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Product Revenue{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: { revenue: item.total },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faBook} /> All time revenue
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.total ?? null) ?? <NumberLoader />}
            </span>
          </div>

          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faCalendar} /> This month revenue
              <span className="ml-2 text-sm font-bold ">
                {(() => {
                  const latest = data?.monthly.at(-1)?.total ?? 0;
                  const previous = data?.monthly.at(-2)?.total ?? 0;
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
              {formatNumber(data?.monthly.at(-1).total ?? null) ?? (
                <NumberLoader />
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="panel-4 grow flex flex-col items-start">
          <span>
            <FontAwesomeIcon icon={faBoxes} /> Best selling all time
          </span>
          <ul className="flex flex-wrap gap-2">
            {data?.top3?.map((item) => {
              return (
                <li key={item._id} className="flex flex-col gap-2 panel-3">
                  <ProductCard product={item} loading={false} />

                  <span className="text-sm font-semibold">
                    {formattedPrice(item.revenue)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="panel-4 grow flex flex-col items-start">
          <span>
            <FontAwesomeIcon icon={faBoxesPacking} /> Best selling this month
          </span>
          <ul className="flex flex-wrap gap-2">
            {data?.monthly.at(-1).top3?.map((item) => {
              return (
                <li key={item._id} className="flex flex-col gap-2 panel-3">
                  <ProductCard product={item} loading={false} />

                  <span className="text-sm font-semibold">
                    {formattedPrice(item.revenue)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
