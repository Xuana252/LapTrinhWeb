"use client";
import Chart from "@components/UI/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { formatNumber } from "@util/format";

import { faResolving } from "@node_modules/@fortawesome/free-brands-svg-icons";
import {
  faCheckSquare,
  faSquare,
} from "@node_modules/@fortawesome/free-regular-svg-icons";
import {
  faCalendar,
  faUserPlus,
  faUserClock,
  faCalendarDay,
  faAnglesUp,
  faAnglesDown,
  faAnglesRight,
  faTrophy,
  faClock,
  faCheckCircle,
  faCheckDouble,
  faBorderAll,
  faImage,
  faComment,
  faListCheck,
  faFlagCheckered,
  faFlag,
  faTruck,
  faBox,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getOrder, getOrderData } from "@service/order";

export default function OrderSection() {
  const [data, setData] = useState(null);

  const fetchOrderData = async () => {
    getOrderData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div className="panel-3 flex flex-col gap-2">
      <div className="font-bold text-xl panel-3">
        <FontAwesomeIcon icon={faTruck} /> Orders
      </div>
      <div className="grid grid-cols-1 grow items-center gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type="Line"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Orders{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: {
                  order: item.count.order,
                  delivered: item.count.delivered,
                  cancelled: item.count.cancelled,
                },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faClock} /> Today count
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.today ?? null) ?? <NumberLoader />}
            </span>
          </div>
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faSquare} /> Pending
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.todayPending ?? null) ?? <NumberLoader />}
            </span>
          </div>
          <div className="panel-4 grow flex flex-wrap gap-2 items-start">
            <div className="grow basis-[40%]">
              <span>
                <FontAwesomeIcon icon={faBorderAll} /> Total
              </span>
              <div className="font-mono text-2xl font-bold">
                {formatNumber(data?.order ?? null) ?? <NumberLoader />}
              </div>
            </div>
            {["pending", "delivered", "cancelled"].map((key) => {
              const value = data?.[key];

              return (
                <div key={key} className="grow basis-[40%]">
                  <span className="">{key}</span>{" "}
                  <div className="font-mono text-2xl font-bold">
                    {formatNumber(value ?? null) ?? <NumberLoader />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="panel-4 text-sx grow flex flex-wrap items-start">
            {(() => {
              const monthly = data?.monthly ?? [];
              const latestCount = monthly.at(-1)?.count || {};
              const previousCount = monthly.at(-2)?.count || {};

              const latestMonth = `${monthly?.at(-1)?._id.year}/${
                monthly?.at(-1)?._id.month
              }`;

              const totalMonth = latestCount?.order ?? null;

              const allKeys = new Set([
                ...Object.keys(latestCount),
                ...Object.keys(previousCount),
              ]);

              const diff = {};

              for (const key of Array.from(allKeys)) {
                const latestVal = latestCount[key] ?? 0;
                const prevVal = previousCount[key] ?? 0;
                diff[key] = latestVal - prevVal;
              }

              const monthdiff = diff["order"];

              return (
                <>
                  <div className="grow basis-[40%]">
                    <span>
                      <FontAwesomeIcon icon={faCalendarDay} /> {latestMonth}{" "}
                      <span
                        className={`inline-block text-xs ml-2 font-bold ${
                          monthdiff > 0
                            ? "text-green-400"
                            : monthdiff < 0
                            ? "text-red-400"
                            : "text-yellow-400"
                        } p-1 rounded-lg bg-black `}
                      >
                        <FontAwesomeIcon
                          icon={
                            monthdiff > 0
                              ? faAnglesUp
                              : monthdiff < 0
                              ? faAnglesDown
                              : faAnglesRight
                          }
                        />{" "}
                        {Math.abs(monthdiff)}
                      </span>
                    </span>

                    <div className="font-mono text-2xl font-bold">
                      {totalMonth ?? <NumberLoader />}
                    </div>
                  </div>
                  {["order", "delivered", "cancelled"].map((key) => {
                    const value = data?.monthly.at(-1)?.count[key];
                    const change = diff[key] ?? 0;
                    return (
                      <div key={key} className="grow basis-[40%]">
                        <span className="">{key}</span>{" "}
                        <span className="ml-2 text-sm font-bold">
                          <span
                            className={`inline-block text-xs ${
                              change > 0
                                ? key !== "cancelled"
                                  ? "text-green-400"
                                  : "text-red-400"
                                : change < 0
                                ? key !== "cancelled"
                                  ? "text-red-400"
                                  : "text-green-400"
                                : "text-yellow-400"
                            } p-1 rounded-lg bg-black`}
                          >
                            <FontAwesomeIcon
                              icon={
                                change > 0
                                  ? faAnglesUp
                                  : change < 0
                                  ? faAnglesDown
                                  : faAnglesRight
                              }
                            />{" "}
                            {formatNumber(Math.abs(change))}
                          </span>
                        </span>
                        <div className="font-mono text-2xl font-bold">
                          {formatNumber(value ?? null) ?? <NumberLoader />}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
