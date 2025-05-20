export const addresses = [
  {
    province: "Thành phố Đà Nẵng",
    districts: [
      {
        district: " Hòa Vang",
        wards: ["Hòa Bắc"],
      },
      {
        district: "Hải Châu",
        wards: ["Bình Hiên", "Thạch Thang"],
      },
    ],
  },
  {
    province: "Thành phố Hồ Chí Minh",
    districts: [
      {
        district: "Quận 1",
        wards: ["Bến Nghé", "Nguyễn Thái Bình"],
      },
      {
        district: "Quận 2",
        wards: ["Thủ Thiêm", "An Khánh"],
      },
    ],
  },
  {
    province: "Thành phố Hà Nội",
    districts: [
      {
        district: "Hoàn Kiếm",
        wards: ["Hàng Bạc", "Tràng Tiền"],
      },
      {
        district: "Quận Đống Đa",
        wards: ["Văn Chương", "Thịnh Quang"],
      },
    ],
  },
];

export const generateDummyCustomerAddresses = (numAddresses) => {
  const addressesList = Array.from({ length: numAddresses }, () => {
    const randomProvince =
      addresses[Math.floor(Math.random() * addresses.length)];
    const randomDistrict =
      randomProvince.districts[
        Math.floor(Math.random() * randomProvince.districts.length)
      ];
    const randomWard =
      randomDistrict.wards[
        Math.floor(Math.random() * randomDistrict.wards.length)
      ];

    // Create a dummy address string (can be adjusted as needed)
    const detailed_address = `${Math.round(
      Math.random() * 999
    )} đường ${Math.round(Math.random() * 99)}`;

    return {
      detailed_address,
      province: randomProvince.province,
      district: randomDistrict.district,
      ward: randomWard,
      name: `Customer ${Math.floor(Math.random() * 1000)}`, // Generate a random name
      phone_number: `+84${Math.floor(Math.random() * 900000000) + 100000000}`, // Generate a random phone number
    };
  });

  return addressesList;
};
