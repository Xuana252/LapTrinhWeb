"use client";

import Chart from "@components/UI/Chart";
import { NumberLoader } from "@components/UI/Loader";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAnglesDown,
  faAnglesRight,
  faAnglesUp,
  faAngleUp,
  faBorderAll,
  faCalendar,
  faImage,
  faMoneyBill1Wave,
  faMoneyBills,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getRevenueData } from "@service/order";
import { formatNumber } from "@util/format";
import React, { useEffect, useState } from "react";

const RevenueSection = () => {
  const [data, setData] = useState(null);

  const fetchRevenueData = async () => {
    getRevenueData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);
  return (
    <div className="panel-3 flex flex-col gap-2  ">
      <div className="font-bold text-xl panel-3 ">
        <FontAwesomeIcon icon={faMoneyBills} /> Revenue
      </div>
      <div className="grid grid-cols-1 grow items-center gap-2 ">
        <Chart
          type="Bar"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Revenue{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: { revenue: item.count },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faMoneyBill1Wave} /> Total Revenue
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.total ?? null) ?? <NumberLoader />}
            </span>
          </div>
          <div className="panel-4 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faCalendar} /> This month
              <span className="ml-2 text-sm font-bold ">
                {(() => {
                  const latest = data?.monthly.at(-1)?.count ?? 0;
                  const previous = data?.monthly.at(-2)?.count ?? 0;
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
              {formatNumber(data?.monthly.at(-1).count ?? null) ?? (
                <NumberLoader />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;
