import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  LabelList,
} from "recharts";
import { AppLogoLoader } from "./Loader";

export default function Chart({
  data,
  name,
  type,
  stack,
}) {
  const flattenedData = data?.map((item) => ({
    id: item.id,
    ...item.value,
  }));

  const keys = Object.keys(data ? data[0]?.value : {});

  const colors = [
    "#87cefa",
    "#cd5c5c",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#da70d6",
    "#32cd32",
    "#ff69b4",
    "#ba55d3",
  ];

  if (!data) {
    return (
      <div
        className="panel p-2  grow text-xs py-2 h-full"
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="w-full flex flex-col items-center justify-center overflow-x-auto h-full min-h-[300px] text-primary">
          <AppLogoLoader />
        </div>
      </div>
    );
  }
  if (type === "Bar") {
    return (
      <div
        className="panel p-2  grow text-xs py-2 h-full  "
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="flex flex-wrap gap-2 p-2 rounded-lg ">
          {keys.map((entry, index) => {
            return (
              <span
                key={`cell-${index}`}
                className={`font-mono`}
                style={{ color: `${colors[index % colors.length]}` }}
              >
                {entry}
              </span>
            );
          })}
        </div>
        <div className="w-full overflow-x-auto flex flex-row-reverse h-fit mt-auto">
          <div
            className="z-0 h-full w-full"
            style={{ minWidth: `${data.length * 60}px` }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={flattenedData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barSize={20}
              
              >
                <XAxis dataKey="id" />
                <Tooltip />

                {keys.map((key, i) => (
                  <Bar key={key} dataKey={key} fill={colors[i % colors.length]}  stackId={stack?"yes":""}>
                    <LabelList dataKey={key} position={"top"} />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
  if (type === "Area")
    return (
      <div
        className="panel p-2  grow text-xs py-2  h-full"
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="flex flex-wrap gap-2 p-2 rounded-lg ">
          {keys.map((entry, index) => {
            return (
              <span
                key={`cell-${index}`}
                className={`font-mono`}
                style={{ color: `${colors[index % colors.length]}` }}
              >
                {entry}
              </span>
            );
          })}
        </div>
        <div className="w-full overflow-x-auto flex flex-row-reverse h-fit mt-auto">
          <div
            className="z-0 h-full w-full"
            style={{ minWidth: `${data.length * 60}px` }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={flattenedData}
                margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                barSize={10}
              >
                {keys.map((key, index) => (
                  <defs key={index}>
                    <linearGradient
                      id={`color_${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="20%"
                        stopColor={colors[index % colors.length]}
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="98%"
                        stopColor={colors[index % colors.length]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                ))}

                <XAxis dataKey="id" />
                <Tooltip />
                {keys.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fillOpacity={1}
                    fill={`url(#color_${key})`}
                    stroke={colors[index % colors.length]}
                  >
                    <LabelList dataKey={key} position={"top"} />
                  </Area>
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );

  if (type === "Line")
    return (
      <div
        className="panel p-2  grow text-xs py-2  h-full"
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="flex flex-wrap gap-2 p-2 rounded-lg ">
          {keys.map((entry, index) => {
            return (
              <span
                key={`cell-${index}`}
                className={`font-mono`}
                style={{ color: `${colors[index % colors.length]}` }}
              >
                {entry}
              </span>
            );
          })}
        </div>
        <div className="w-full overflow-x-auto h-fit flex flex-row-reverse mt-auto">
          <div
            className="z-0  w-full"
            style={{ minWidth: `${data.length * 60}px` }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={flattenedData}
                margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                barSize={10}
              >
                <XAxis dataKey="id" />
                <Tooltip />
                {keys.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    stroke={colors[index % colors.length]}
                  >
                    <LabelList dataKey={key} position={"top"} />
                  </Line>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );

  if (type === "Pie") {
    return (
      <div>
        <div
          className="panel p-2  grow text-xs py-2 "
          style={{ background: "white", color: "black" }}
        >
          <div className="font-bold text-lg">{name}</div>

          <div className="flex w-full gap-2 items-center flex-col">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart data={[...data]}>
                {
                  <Pie
                    data={flattenedData}
                    dataKey={keys[0]}
                    nameKey="id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#82ca9d"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                }
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-white">
              {data?.map((entry, index) => {
                const valueObj = entry.value
                const firstKey = Object.keys(valueObj)[0];
                const firstValue = valueObj[firstKey];
                return (
                  <span
                    key={`cell-${index}`}
                    className={`font-mono `}
                    style={{ color: `${colors[index % colors.length]}` }}
                  >
                    {entry.id}({firstValue})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}
