"use client";
import Chart from "@components/UI/Chart";
import {
  faCalendar,
  faSortAmountAsc,
  faSortAmountDesc,
  faSortNumericAsc,
  faTags,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getCategoryData } from "@service/category";
import { formatNumber } from "@util/format";
import React, { useEffect, useState } from "react";

export default function CategorySection() {
  const [data, setData] = useState(null);

  const fetchCategoryData = async () => {
    getCategoryData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);
  return (
    <div className="panel-3 flex flex-col gap-2 ">
      <div className="font-bold text-xl panel-3">
        <FontAwesomeIcon icon={faTags} /> Categories
      </div>
      <div className="grid grid-cols-1 items-center gap-2 ">
        <Chart
          type={"Line"}
          stack={true}
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Categories Revenue
            </div> 
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: item.categories.reduce((acc, c) => {
                  acc[c.category.category_name] = c.revenue;
                  return acc;
                }, {}),
              };
            }) || null
          }
        />
        <Chart
          type={"Pie"}
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> This Month Categories Revenue
            </div>
          }
          data={
            data?.monthly?.at(-1)?.categories.map((item) => {
              return {
                id: `${item.category.category_name}`,
                value: { revenue: item.revenue },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto grow    panel-4">
            <div>
              <FontAwesomeIcon icon={faTags} /> All time
            </div>
            <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
              {data?.alltime?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 bg-primary border-secondary-variant border-2  rounded overflow-hidden max-w-[120px] "
                  title={item.category.category_name}
                >
                  <span className="p-1">{formatNumber(item.revenue)}</span>
                  <div className="bg-secondary-variant w-full p-1 text-xs text-on-secondary">
                    {item.category.category_name}
                  </div>
                </div>
              )) ||
                Array.from({ length: 10 }).map((item, index) => (
                  <div
                    key={index}
                    className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded"
                  >
                    Category
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto grow    panel-4">
            <div>
              <FontAwesomeIcon icon={faSortAmountAsc} /> Best selling
            </div>
            <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
              {data?.alltime
                ?.sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 bg-primary border-2 border-green-400  rounded overflow-hidden max-w-[120px] "
                    title={item.category.category_name}
                  >
                    <span className="p-1">{formatNumber(item.revenue)}</span>
                    <div className="bg-secondary-variant w-full p-1 text-xs text-on-secondary">
                      {item.category.category_name}
                    </div>
                  </div>
                )) ||
                Array.from({ length: 3 }).map((item, index) => (
                  <div
                    key={index}
                    className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded"
                  >
                    Category
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto grow    panel-4">
            <div>
              <FontAwesomeIcon icon={faSortAmountDesc} /> Worst selling
            </div>
            <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
              {data?.alltime
                ?.sort((a, b) => a.count - b.count)
                .slice(0, 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 bg-primary border-yellow-400 border-2  rounded overflow-hidden max-w-[120px] "
                    title={item.category.category_name}
                  >
                    <span className="p-1">{formatNumber(item.revenue)}</span>
                    <div className="bg-secondary-variant w-full p-1 text-xs text-on-secondary">
                      {item.category.category_name}
                    </div>
                  </div>
                )) ||
                Array.from({ length: 3 }).map((item, index) => (
                  <div
                    key={index}
                    className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded"
                  >
                    Category
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto grow    panel-4">
            <div>
              <FontAwesomeIcon icon={faSortAmountAsc} /> Best selling this month
            </div>
            <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
              {data?.monthly
                ?.at(-1)
                .categories?.sort((a, b) => a.revenue - b.revenue)
                .slice(0, 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 bg-primary border-green-400 border-2  rounded overflow-hidden max-w-[120px] "
                    title={item.category.category_name}
                  >
                    <span className="p-1">{formatNumber(item.revenue)}</span>
                    <div className="bg-secondary-variant w-full p-1 text-xs text-on-secondary">
                      {item.category.category_name}
                    </div>
                  </div>
                )) ||
                Array.from({ length: 3 }).map((item, index) => (
                  <div
                    key={index}
                    className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded"
                  >
                    Category
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto grow    panel-4">
            <div>
              <FontAwesomeIcon icon={faSortAmountDesc} /> Worst selling this
              month
            </div>
            <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
              {data?.monthly
                ?.at(-1)
                .categories?.sort((a, b) => a.revenue - b.revenue)
                .slice(0, 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 bg-primary border-yellow-400 border-2    rounded overflow-hidden max-w-[120px] "
                    title={item.category.category_name}
                  >
                    <span className="p-1">{formatNumber(item.revenue)}</span>
                    <div className="bg-secondary-variant w-full p-1 text-xs text-on-secondary">
                      {item.category.category_name}
                    </div>
                  </div>
                )) ||
                Array.from({ length: 3 }).map((item, index) => (
                  <div
                    key={index}
                    className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded"
                  >
                    Category
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
