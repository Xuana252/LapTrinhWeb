import { faRobot } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Link from "@node_modules/next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="size-full flex flex-col gap-4 items-center justify-center text-xl font-semibold text-on-background">
      <FontAwesomeIcon icon={faRobot} size="2xl" />
      <p>Sorry, there is nothing here...</p> 
      <Link href="/" className="underline font-normal hover:font-semibold">Take me back</Link>
    </div>
  );
};

export default NotFoundPage;
