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


export const generateMockCategoryRevenueData = (months = 6) => {
  const now = new Date();
  const monthly = Array.from({ length: months }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - i - 1),
      1
    );
    return {
      _id: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      },
      count: Math.floor(Math.random() * 200) + 100,
      revenue: Math.floor(Math.random() * 200000000) + 100000000,
    };
  });

  return {
    total: monthly.reduce((acc, curr) => acc + curr.revenue, 0),
    sold: monthly.reduce((acc, curr) => acc + curr.count, 0),
    monthly,
  };
};

export const  generateMockCategoryData = (months=6) => {
  const now = new Date();
  const alltime = categoriesPreset.map((cat) => ({
    category: cat,
    count: Math.floor(Math.random() * 1000) + 200,
    revenue: Math.floor(Math.random() * 100000000) + 100000000, // total count
  }));


  
  const monthly = Array.from({ length: months }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - i - 1),
      1
    );
    return {
      _id: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      },
      categories:categoriesPreset.map((cat) => ({
        category: cat,
        count: Math.floor(Math.random() * 200) + 100,
        revenue: Math.floor(Math.random() * 1000000) + 1000000, // total count
      }))

    };
  });

  return {
    alltime,
    monthly,
  };
 
}
