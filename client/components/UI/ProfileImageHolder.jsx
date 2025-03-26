"use client";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ProfileImageHolder = ({ url, size=100 }) => {
  const [isValid, setIsValid] = useState(false);

  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true); // URL is valid and image loaded
      img.onerror = () => resolve(false); // URL is invalid or image failed to load
      img.src = url;
    });
  };

  useEffect(() => {
    if(!url) return
    testImageUrl(url).then((result) => setIsValid(result));
  }, [url]);

  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {isValid ? (
        <Image
          src={url}
          alt="Profile image"
          className="size-full object-cover"
          width={size}
          height={size}
        />
      ) : (
        <FontAwesomeIcon icon={faUserCircle} className="md:text-6xl text-xl size-full" />
      )}
    </div>
  );
};

export default ProfileImageHolder;
