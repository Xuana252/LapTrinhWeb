import { faTrash } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Image from "@node_modules/next/image";
import { handleImage, testImageUrl } from "@util/image";
import { toastError, toastSuccess } from "@util/toaster";
import React, { useEffect, useRef, useState } from "react";

const ProductImageTab = ({ images, onChange }) => {
  const [selectedImageId, setSelectedImageId] = useState(0);
  const productImageListRef = useRef(null);
  const imageInputRef = useRef(null);

  const changeImage = ({ name, url }) => {

    onChange([
      ...images,
      {
        name,
        url,
      },
    ]);
  };

  const handleDeleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    setSelectedImageId((prev) => (prev > index ? prev - 1 : prev));
  };

  const handleAddImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 3 * 1024 * 1024) {
        imageInputRef.current ? (imageInputRef.current.value = "") : null;
        toastError("File size must be less than 3MB");
        return;
      }
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      const isValidURL = await testImageUrl(objectUrl);
      if (isValidURL) {
        await handleImage(file, changeImage);
        toastSuccess("Image added successfully");
      } else {
        toastError("Invalid URL");
      }
    } else {
      toastError("Something went wrong, please try again");
    }
    imageInputRef.current ? (imageInputRef.current.value = "") : null;
  };

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
      <input
        ref={imageInputRef}
        type="file"
        className="absolute invisible size-1"
        onChange={handleImageChange}
        accept="image/*"
      />
      <div className="w-full max-w-[500px] max-h-[500px] relative  order-1 md:order-2 ">
        <ul
          ref={productImageListRef}
          className="w-full size-full  flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 "
        >
          {images?.map((image, index) => (
            <li
              key={index}
              className="min-w-full h-fit relative flex items-center justify-center "
            >
              <Image
                src={image.url}
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
      <div className=" w-full flex flex-col gap-2 order-2 md:order-1 max-h-[600px] overflow-hidden">
        <div className=" w-full flex md:flex-col flex-row   gap-2 overflow-hidden ">
          <button
            className={` bg-on-background/20 aspect-square font-semibold text-lg rounded overflow-hidden size-[80px] shrink-0`}
          >
            +{images?.length}
          </button>
          <ul className=" w-full  flex flex-row md:flex-col gap-2 max-w-full py-1 overflow-auto snap-x  md:snap-y  snap-mandatory">
            {images?.map((image, index) => (
              <li
                key={index}
                className={`aspect-square  size-[80px] shrink-0 transition-transform duration-200 snap-start relative`}
              >
                <Image
                  src={image.url}
                  alt="product image "
                  width={200}
                  height={200}
                  blurDataURL="data:/images/PLACEHOLDER.jpg"
                  placeholder="blur"
                  className={`size-full object-cover outline-none rounded overflow-hidden  ${
                    selectedImageId === index
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-50"
                  }`}
                  onClick={() => handleSetSelectedId(index)}
                />
                <button
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded text-xs "
                  onClick={() => handleDeleteImage(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleAddImage}
          className={` bg-surface/70 hover:bg-surface font-semibold  rounded overflow-hidden p-2  shrink-0`}
        >
          +Add 
        </button>
      </div>
    </div>
  );
};

export default ProductImageTab;
