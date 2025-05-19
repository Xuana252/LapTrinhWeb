import { categoriesPreset } from "./category";

export const randomImage = () => {
  const images = [
    "https://www.foto-bern.ch/wp-content/uploads/2022/07/Portrait-357.-vorschau.jpg",
    "https://franchisematch.com/wp-content/uploads/2015/02/john-doe.jpg",
    "https://ih1.redbubble.net/image.3150723596.2110/raf,360x360,075,t,fafafa:ca443f4786.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

export const generateDummyCustomerData = (id) => {
  const randomUsername = () =>
    `user_${Math.random().toString(36).substr(2, 7)}`;

  const randomPhoneNumber = () =>
    `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
  const randomEmail = () => `${randomUsername()}@example.com`;

  // Generate birthdate for a customer aged between 18 and 70 years
  const minAge = 18;
  const maxAge = 70;
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthdate = new Date();
  birthdate.setFullYear(birthdate.getFullYear() - age);

  return {
    image: randomImage(),
    _id: id || `customer-${Math.floor(Math.random() * 100000)}`,
    email: randomEmail(),
    username: randomUsername(),
    phone_number: randomPhoneNumber(),
    is_active: Math.random() >= 0.5,
    createdAt: new Date(
      new Date().getTime() - Math.floor(Math.random() * 3.154e10)
    ).toISOString(), // Random date within the last year
  };
};

export const generateDummyCustomersData = (num = 10) => {
  let users = [];

  for (let i = 0; i < num; i++) {
    users.push({
      ...generateDummyCustomerData(i.toString()),
      revenue: Math.floor(Math.random() * 30000000 + 10000000),
    });
  }
  return { data: users, count: Math.floor(Math.random() * 30 + 20) };
};

export const generateMockUserData = (months = 6) => {
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
      count: Math.floor(Math.random() * 2000) + 500,
    };
  });

  const total = monthly.reduce((acc, curr) => acc + curr.count, 0);
  const today = Math.floor(Math.random() * 300) + 200; // daily new users
  const banned = Math.floor(Math.random() * (total * 0.3)); // up to 30% of total

  return {
    total,
    today,
    banned,
    monthly,
  };
};

export const generateDummyCustomerRevenueData = (months = 6) => {
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
      revenue: Math.floor(Math.random() * 2000000) + 1000000,
    };
  });

  const shuffled = categoriesPreset.sort(() => 0.5 - Math.random());
  const categories = shuffled.slice(0, 3);

  return {
    monthly,
    total: monthly.reduce((acc, curr) => acc + curr.revenue, 0),
    categories,
  };
};
