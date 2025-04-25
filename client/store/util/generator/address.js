export const addresses = [
  {
    province: "Thành phố Đà Nẵng",
    districts: [
      {
        district: "Huyện Hòa Vang",
        wards: ["Xã Hòa Bắc"],
      },
      {
        district: "Quận Hải Châu",
        wards: ["Phường Bình Hiên", "Phường Thạch Thang"],
      },
    ],
  },
  {
    province: "Thành phố Hồ Chí Minh",
    districts: [
      {
        district: "Quận 1",
        wards: ["Phường Bến Nghé", "Phường Nguyễn Thái Bình"],
      },
      {
        district: "Quận 2",
        wards: ["Phường Thủ Thiêm", "Phường An Khánh"],
      },
    ],
  },
  {
    province: "Thành phố Hà Nội",
    districts: [
      {
        district: "Quận Hoàn Kiếm",
        wards: ["Phường Hàng Bạc", "Phường Tràng Tiền"],
      },
      {
        district: "Quận Đống Đa",
        wards: ["Phường Văn Chương", "Phường Thịnh Quang"],
      },
    ],
  },
];



export const generateDummyCustomerAddresses = (numAddresses) => {
    const addressesList = Array.from({ length: numAddresses }, () => {
      const randomProvince = addresses[Math.floor(Math.random() * addresses.length)];
      const randomDistrict = randomProvince.districts[Math.floor(Math.random() * randomProvince.districts.length)];
      const randomWard = randomDistrict.wards[Math.floor(Math.random() * randomDistrict.wards.length)];
      
      // Create a dummy address string (can be adjusted as needed)
      const address = `${Math.round(Math.random()*999)} đường ${Math.round(Math.random()*99)}`;
  
      return {
        address,
        province: randomProvince.province,
        district: randomDistrict.district,
        ward: randomWard,
        full_name: `Customer ${Math.floor(Math.random() * 1000)}`, // Generate a random name
        phone_number: `+84${Math.floor(Math.random() * 900000000) + 100000000}`, // Generate a random phone number
        is_primary: false, 
      };
    });
  
    // Randomly select one address to be the default
    const defaultIndex = Math.floor(Math.random() * addressesList.length);
    addressesList[defaultIndex].is_primary = true; // Set the selected address as default
  
    return addressesList;
  };
