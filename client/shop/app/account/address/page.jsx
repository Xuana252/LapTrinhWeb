"use client";
import {
  deleteCustomerAddress,
  fetchDistricts,
  fetchProvinces,
  fetchWards,
  getCustomerAddresses,
  patchCustomerAddress,
  postCustomerAddress,
} from "@service/address";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import Divider from "@components/UI/Layout/Divider";
import React, { useEffect, useState } from "react";
import { useSession } from "@node_modules/next-auth/react";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faMinus,
  faTrash,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";

const Address = () => {
  const session = useSelector((state) => state.session);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAddresses, setIsUpdatingAddresses] = useState("");
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone_number: "",
    detailed_address: "",
    province: "",
    district: "",
    ward: "",
  });
  const [skip_flag, setSkip_Flag] = useState(false);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [wards, setWards] = useState();
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const checkEmptyInput = () => {
    if (
      !province ||
      !district ||
      !ward ||
      !newAddress.detailed_address.trim() ||
      !newAddress.name.trim() ||
      !newAddress.phone_number.trim() ||
      !province.name.trim() ||
      !district.name.trim() ||
      !ward.name.trim()
    ) {
      toastWarning("Please fill out all field");
      return true;
    }
    return false;
  };
  const deleteAddress = (id) => {
    deleteCustomerAddress(session.customer.customer_id, id).then(
      (data) => {
        if (data) {
          toastSuccess("Address deleted");
          setAddresses(
            addresses.filter((address) => address.address_id !== id)
          );
        } else {
          toastError("Failed to delete address");
        }
      }
    );
  };
  const addAddress = () => {
    const payload = {
      detailed_address: newAddress.address,
      province: province.name,
      district: district.name,
      ward: ward.name,
      name: newAddress.name,
      phone_number: newAddress.phone_number,
    };
    setIsUpdatingAddresses("");
    postCustomerAddress(session.customer.customer_id, payload).then((data) => {
      if (data) {
        toastSuccess("Address added");
        setAddresses((prev) => [...prev, data]);
      } else {
        toastError("Failed to add address");
      }
    });
  };

  const updateAddress = (id) => {
    const payload = {
      detailed_address: newAddress.address,
      province: province.name,
      district: district.name,
      ward: ward.name,
      name: newAddress.full_name,
      phone_number: newAddress.phone_number,
    };
    setIsUpdatingAddresses("");
    patchCustomerAddress(session.customer.customer_id, payload).then((data) => {
      if (data) {
        toastSuccess("Address updated");
        setAddresses(
          addresses.map((address) => {
            return address._id === newAddress._id ? data : address;
          })
        );
      } else {
        toastError("Failed to update address");
      }
    });
  };
  const fetchAddress = () => {
    setIsLoading(true);
    getCustomerAddresses(session.customer?.customer_id).then((data) => {
      setAddresses(data);
    });

    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    if (skip_flag) return;
    setDistrict(null);
    getDistricts(province?.id || "");
  }, [province]);

  useEffect(() => {
    if (skip_flag) return;
    setWard(null);
    getWards(district?.id || "");
  }, [district]);

  const getProvinces = async () => {
    const provinces = await fetchProvinces();

    setProvinces(
      provinces.map((item) => {
        return { id: item.province_id, name: item.province_name };
      })
    );
  };

  const getDistricts = async (id) => {
    const districts = await fetchDistricts(id);

    setDistricts(
      districts.map((item) => {
        return { id: item.district_id, name: item.district_name };
      })
    );
  };

  const getWards = async (id) => {
    const wards = await fetchWards(id);

    setWards(
      wards.map((item) => {
        return { id: item.ward_id, name: item.ward_name };
      })
    );
  };

  useEffect(() => {
    if (!session.isAuthenticated) return;
    getProvinces();
    fetchAddress();
  }, [session]);

  useEffect(() => {
    if (!isUpdatingAddresses) {
      setWards([]);
      setDistricts([]);
    } else if (isUpdatingAddresses === "Adding") {
      setProvince(null);
      setDistrict(null);
      setWard(null);
      setNewAddress({
        id: "",
        name: "",
        phone_number: "",
        detailed_address: "",
        province: "",
        district: "",
        ward: "",
      });
    }
  }, [isUpdatingAddresses]);

  const handleAddNewAddress = () => {
    if (checkEmptyInput()) return;
    addAddress();
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
  };

  const handleUpdateAddress = () => {
    if (checkEmptyInput()) return;
    updateAddress(newAddress.address_id);
    setIsUpdatingAddresses("");
  };

  const updateAddressInfo = (name, value) => {
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitUpdateAddress = async (id) => {
    setIsUpdatingAddresses("");
    setSkip_Flag(true);

    const selectedAddress = addresses.find((item) => item._id === id);
    setNewAddress(selectedAddress);

    const { ward, district, province } = selectedAddress;

    const provinceList = await fetchProvinces();
    const formattedProvinces = provinceList.map((prov) => {
      return { id: prov.province_id, name: prov.province_name };
    });
    setProvinces(formattedProvinces);

    const selectedProvince = formattedProvinces.find(
      (prov) => prov.name === province
    );

    if (selectedProvince) {
      setProvince(selectedProvince);
      const districtList = await fetchDistricts(selectedProvince.id);
      const formattedDistricts = districtList.map((dist) => {
        return { id: dist.district_id, name: dist.district_name };
      });
      setDistricts(formattedDistricts);

      const selectedDistrict = formattedDistricts.find(
        (dist) => dist.name === district
      );
      if (selectedDistrict) {
        setDistrict(selectedDistrict);
        const wardList = await fetchWards(selectedDistrict.id);
        const formattedWards = wardList.map((w) => {
          return { id: w.ward_id, name: w.ward_name };
        });
        setWards(formattedWards);

        const selectedWard = formattedWards.find((w) => w.name === ward);
        setWard(selectedWard);
      }
    }
    setIsUpdatingAddresses("Updating");
    setSkip_Flag(false);
  };

  return (
    <section className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">My Address</div>
          <div className="text-sm opacity-60">Manage your shipping address</div>
        </div>
        <div>
          <button
            className="button-variant-1"
            onClick={() => setIsUpdatingAddresses("Adding")}
          >
            Add address
          </button>
        </div>
      </div>
      <Divider />
      {/* adding new address section */}
      {isUpdatingAddresses && (
        <div className="z-20">
          <div className="flex flex-col py-4 gap-4 bg-surface rounded-lg p-2">
            <InputBox
              value={newAddress.name}
              name={"Full name *"}
              onChange={(n) => updateAddressInfo("name", n)}
            />
            <PhoneInput
              value={newAddress.phone_number}
              name={"Phone number *"}
              onChange={(n) => updateAddressInfo("phone_number", n)}
              maxLength={10}
            />
            <div className="flex gap-4 flex-wrap  items-center h-fit rounded-xl w-full z-50">
              <DropDownButton
                value={province}
                options={provinces}
                name="province"
                onChange={setProvince}
                zIndex={70}
              />
              <DropDownButton
                value={district}
                options={districts}
                name="district"
                onChange={setDistrict}
                zIndex={60}
              />
              <DropDownButton
                value={ward}
                options={wards}
                name="ward"
                onChange={setWard}
                zIndex={50}
              />
            </div>
            <InputBox
              value={newAddress.detailed_address}
              name={"Specific address *"}
              onChange={(n) => updateAddressInfo("detailed_address", n)}
            />
            <div className="ml-auto flex flex-wrap gap-4">
              <button
                className="button-variant-2"
                onClick={() => {
                  setIsUpdatingAddresses("");
                }}
              >
                Cancel
              </button>
              <button
                className="button-variant-2"
                onClick={
                  isUpdatingAddresses === "Adding"
                    ? handleAddNewAddress
                    : isUpdatingAddresses === "Updating"
                    ? handleUpdateAddress
                    : () => {}
                }
              >
                Save address
              </button>
            </div>
          </div>
        </div>
      )}
      {/* address list section */}
      <div className="flex flex-col gap-4 w-full">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <li
                key={index}
                className="grid grid-cols gap-3 items-start w-full bg-surface rounded-lg p-2 min-h-[70px]"
              >
                <div className="flex flex-col items-start gap-2 justify-around text-base">
                  <h2 className="flex items-center gap-2">
                    <div className="h-7 font-semibold w-[100px] bg-primary rounded-lg animate-pulse"></div>

                    <div className="h-6 w-[100px] bg-primary rounded-lg animate-pulse"></div>
                  </h2>
                  <h3 className="h-6 w-[150px] bg-primary rounded-lg animate-pulse"></h3>
                  <h3 className="h-6 w-full  max-w-[400px] bg-primary rounded-lg animate-pulse"></h3>
                </div>
                <div className="w-full flex flex-wrap justify-between col-span-2">
                  <div className="flex flex-wrap flex-row-reverse gap-2 ml-auto ">
                    <div className="h-7 w-[70px] bg-primary rounded-lg animate-pulse"></div>
                    <div className="h-7 w-[60px] bg-primary rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </li>
            ))
          : addresses.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 items-start w-full bg-surface rounded-lg p-2 min-h-[70px]"
              >
                <div className="flex flex-col w-full items-start gap-2 justify-around text-base">
                  <h2 className="w-full flex flex-row items-start">
                    <span className="text-xl font-semibold">
                      {item.name} | {item.phone_number}
                    </span>{" "}
                  </h2>
                  <h3 className="opacity-50">{item.detailed_address}</h3>
                  <h3 className="opacity-50">
                    {[item.ward, item.district, item.province].join(", ")}
                  </h3>
                </div>
                <div className="w-full flex flex-wrap justify-between col-span-2">
                  <div className="flex flex-wrap flex-row-reverse gap-2 ml-auto items-center ">
                    <button
                      className="button-variant-1"
                      onClick={() => handleDeleteAddress(item._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="button-variant-2"
                      onClick={() => handleInitUpdateAddress(item._id)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default Address;
