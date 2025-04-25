import { categoriesPreset } from "./category";

const imageSets = [
  {
    images: [
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg",
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg",
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg",
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg",
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg",
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg",
    ],
    productName: "iPhone 14 Pro",
    description: "Apple's latest iPhone 14 Pro with advanced features.",
  },
  {
    images: [
      "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
      "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
      "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg",
      "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
      "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
      "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg",
      "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
      "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
      "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg",
      "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
      "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
      "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg",
      "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
      "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
      "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg",
      "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
      "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
      "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg",
    ],
    productName: "Samsung Galaxy S24 Ultra",
    description:
      "The latest Samsung Galaxy S24 Ultra with top-tier performance.",
  },
  {
    images: [
      "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
      "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
      "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg",
      "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
      "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
      "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg",
      "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
      "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
      "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg",
      "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
      "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
      "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg",
      "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
      "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
      "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg",
      "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
      "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
      "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg",
    ],
    productName: "MacBook Pro M2",
    description:
      "Apple's MacBook Pro powered by the M2 chip, perfect for professionals.",
  },
];

export const generateDummyProductData = (num = 1) => {
  const dummyProducts = [];

  for (let i = 0; i < num; i++) {
    const productId = `cm${Math.random().toString(36)}`;
    const createdAt = new Date().toISOString();
    const randomPrice = Math.floor(Math.random() * 50000000) + 500;
    const randomDiscount = Math.floor(Math.random() * 30) + 10;
    const randomStock = Math.floor(Math.random() * 100) + 1;
    const randomRating = Math.floor(Math.random() * 5) + 1;

    // Select a random set for each product
    const selectedSet = imageSets[Math.floor(Math.random() * imageSets.length)];

    dummyProducts.push({
      product_id: productId,
      product_name: selectedSet.productName,
      images: selectedSet.images,
      description: selectedSet.description,
      price: randomPrice,
      discount: randomDiscount,
      stock_quantity: randomStock,
      created_at: createdAt,
      updated_at: createdAt,
      categories: [
        categoriesPreset[Math.floor(Math.random() * categoriesPreset.length)],
      ],
      average_rating: randomRating,
      attributes: [
        {
          _id: `attr${Math.random().toString(36).substr(2, 12)}`,
          product_id: productId,
          name: `Specs`,
          detail: `Specifications for ${selectedSet.productName}`,
        },
      ],
    });
  }

  return dummyProducts;
};

export const generateDummyProductDetailData = () => {
  const productId = `cm${Math.random().toString(36)}`;
  const createdAt = new Date().toISOString();
  const randomPrice = Math.floor(Math.random() * 50000000) + 500;
  const randomDiscount = Math.floor(Math.random() * 30);
  const randomStock = Math.floor(Math.random() * 100) + 1;

  // Select a random set for the single product
  const selectedSet = imageSets[Math.floor(Math.random() * imageSets.length)];

  return {
    product_id: productId,
    product_name: selectedSet.productName,
    images: selectedSet.images,
    description: selectedSet.description,
    price: randomPrice,
    discount: randomDiscount,
    stock_quantity: randomStock,
    created_at: createdAt,
    updated_at: createdAt,
    categories: [
      categoriesPreset[Math.floor(Math.random() * categoriesPreset.length)],
    ],
    product_feedbacks: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      () => ({
        feedback_id: `cm${Math.random().toString(36).substr(2, 12)}`,
        product_id: productId,
        customer_id: `cm${Math.random().toString(36).substr(2, 12)}`,
        feedback: "This is a random feedback message.",
        rating: Math.floor(Math.random() * 5) + 1,
        created_at: createdAt,
      })
    ),
    attributes: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => ({
        _id: `attr${Math.random().toString(36).substr(2, 12)}`,
        name: `Specification`,
        detail: `Details for ${selectedSet.productName}`,
      })
    ),
  };
};
