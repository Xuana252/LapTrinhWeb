export const categoriesPreset = [
  {
    _id: 1,
    category_name: "Phu Tung 1",
    discount: 10,
  },
  {
    _id: 2,
    category_name: "Phu Tung 2",
    discount: 20,
  },
  {
    _id: 3,
    category_name: "Phu Tung 3",
    discount: 30,
  },
  {
    _id: 4,
    category_name: "Phu Tung 4",
    discount: 40,
  },
  {
    _id: 5,
    category_name: "Phu Tung 5",
    discount: 10,
  },
];

const sampleCategories = [
  { categoryId: "1", name: "Smartphones" },
  { categoryId: "2", name: "Laptops" },
  { categoryId: "3", name: "Tablets" },
  { categoryId: "4", name: "Televisions" },
  { categoryId: "5", name: "Headphones" },
  { categoryId: "6", name: "Cameras" },
];

export const  generateMockCategoryData = () => {
  const category = sampleCategories.map((cat) => ({
    categoryId: cat.categoryId,
    name: cat.name,
    count: Math.floor(Math.random() * 100000000) + 100000000, // total count
  }));

  const thisMonth = sampleCategories.map((cat) => ({
    categoryId: cat.categoryId,
    name: cat.name,
    count: Math.floor(Math.random() * 10000000) + 5000000, // current month count
  }));

  return {
    category,
    thisMonth,
  };
}
