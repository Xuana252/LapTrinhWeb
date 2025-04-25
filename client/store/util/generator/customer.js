
export const randomImage = () => {
  const images = [
    'https://www.foto-bern.ch/wp-content/uploads/2022/07/Portrait-357.-vorschau.jpg',
    'https://franchisematch.com/wp-content/uploads/2015/02/john-doe.jpg',
    'https://ih1.redbubble.net/image.3150723596.2110/raf,360x360,075,t,fafafa:ca443f4786.jpg'
  ];
  return images[Math.floor(Math.random() * images.length)];
};


export const generateDummyCustomerData = (id) => {
  const randomUsername = () =>
    `user_${Math.random().toString(36).substr(2, 7)}`;
  const randomFullName = () => {
    const firstNames = ["John", "Jane", "Alex", "Taylor", "Chris", "Morgan"];
    const lastNames = ["Doe", "Smith", "Brown", "Johnson", "Lee", "Taylor"];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  };


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
    image:randomImage(),
    customer_id: id || `customer-${Math.floor(Math.random() * 100000)}`,
    username: randomUsername(),
    full_name: randomFullName(),
    male: Math.round(Math.random()),
    phone_number: randomPhoneNumber(),
    birth_date: new Date(
      new Date().getTime() - Math.floor(Math.random() * 3.154e10)
    ).toISOString(), // Random date within the last year
    date_joined: new Date(
      new Date().getTime() - Math.floor(Math.random() * 3.154e10)
    ).toISOString(), // Random date within the last year
    account: {
      email: randomEmail(),
    },
  };
};
