import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

const ComponentName = () => {
  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      <h1 className="text-4xl font-bold text-on-background">
        Nhóm 7 NT208.P21.ANTT
      </h1>
      <ul className="flex flex-wrap gap-4 justify-center  w-full max-w-[1000px]">
      <div
          key={1}
          className={` relative w-[250px] aspect-[2/3] grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md`}
        >
          <div
            className={`size-full bg-cover bg-[url('/images/LeNguyenDongXuan.jpg')]`}
          ></div>
          <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
            <div className="flex flex-row justify-end items-center w-full gap-1">
              <div className="  text-white font-semibold py-1 px-2 rounded-md bg-black  w-fit text-xs">
                22521713
              </div>
            </div>
            <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                className="size-12"
                alt="UIT"
                title="University of Information Technology"
              ></img>
              <div className=" text-white font-semibold py-1 px-2 rounded-md bg-black  w-fit text-sm">
                Lê Nguyễn Đông Xuân
              </div>
            </div>
          </div>
        </div>
        <div
          key={2}
          className={` relative w-[250px] aspect-[2/3] grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md`}
        >
          <div
            className={`size-full bg-cover bg-[url('/images/LuuNguyenTheVinh.jpg')]`}
          ></div>
          <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
            <div className="flex flex-row justify-end items-center w-full gap-1">
              <div className="  text-white font-semibold py-1 px-2 rounded-md bg-black  w-fit text-xs">
                22521672
              </div>
            </div>
            <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                className="size-12"
                alt="UIT"
                title="University of Information Technology"
              ></img>
              <div className=" text-white font-semibold py-1 px-2 rounded-md bg-black  w-fit text-sm">
                Lưu Nguyễn Thế Vinh
              </div>
            </div>
          </div>
        </div>
      </ul>
    </section>
  );
};

export default ComponentName;
