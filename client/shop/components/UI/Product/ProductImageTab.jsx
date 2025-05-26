import Image from "@node_modules/next/image";
import React, { useEffect, useRef, useState } from "react";

const ProductImageTab = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState(0);
  const productImageListRef = useRef(null);

  const handleSetSelectedId = (index) => {
    const imageList = productImageListRef.current;
    if (imageList) {
      const selectedImage = imageList.children[index];
      if (selectedImage) {
        const offsetLeft =
          selectedImage.offsetLeft -
          (imageList.clientWidth - selectedImage.clientWidth) / 2;
        imageList.scrollTo({ left: offsetLeft, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const imageList = productImageListRef.current;
    if (!imageList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setSelectedImageId(index);
          }
        });
      },
      {
        root: imageList,
        threshold: 0.5,
      }
    );

    // Observe each image
    Array.from(imageList.children).forEach((image, index) => {
      observer.observe(image);
      image.dataset.index = index;
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="grid grid-rows-[1fr_auto] md:grid-cols-[auto_1fr] gap-2 w-full">
      <div className="w-full relative  order-1 md:order-2 ">
        <ul
          ref={productImageListRef}
          className="w-full size-full  flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 bg-secondary/50"
        >
          {images?.map((image, index) => (
            <li
              key={index}
              className="min-w-full h-fit relative flex items-center justify-center "
            >
              <Image
                src={image}
                alt="product image"
                width={0}
                height={0}
                blurDataURL="data:/images/PLACEHOLDER.jpg"
                placeholder="blur"
                layout="responsive"
                className="size-full object-contain snap-start"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className=" w-full flex md:flex-col flex-row max-h-[600px] order-2 md:order-1 gap-2 overflow-hidden ">
        <button
          className={` bg-on-background/20 aspect-square font-semibold text-lg rounded overflow-hidden size-[80px] shrink-0`}
        >
          +{images?.length}
        </button>
        <ul className=" w-full  flex flex-row md:flex-col gap-2 max-w-full py-1 overflow-auto snap-x  md:snap-y  snap-mandatory">
          {images?.map((image, index) => (
            <button
              key={index}
              className={`aspect-square rounded overflow-hidden size-[80px] shrink-0 transition-transform duration-200 snap-start ${
                selectedImageId === index
                  ? "scale-100 opacity-100"
                  : "scale-90 opacity-50"
              }`}
              onClick={() => handleSetSelectedId(index)}
            >
              <Image
                src={image}
                alt="product image "
                width={200}
                height={200}
                blurDataURL="data:/images/PLACEHOLDER.jpg"
                placeholder="blur"
                className="size-full object-cover outline-none"
              />
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductImageTab;
