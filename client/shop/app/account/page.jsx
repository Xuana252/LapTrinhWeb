"use client";
import DatePicker from "@components/Input/DatePicker";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import Divider from "@components/UI/Divider";
import ProfileImageHolder from "@components/UI/ProfileImageHolder";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSession, useSession } from "@node_modules/next-auth/react";
import { getCustomer, patchCustomer } from "@service/customer";
import { formattedDate } from "@util/format";
import { handleImage } from "@util/image";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import { Input } from "postcss";
import React, { useEffect, useRef, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import { updateSession } from "@provider/redux/session/sessionSlice";

const Account = () => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const [customer, setCustomer] = useState();
  const [image, setImage] = useState({ name: "", url: "" });
  const [gender, setGender] = useState("Male");
  const imagePicker = useRef(null);
  const handleRadioSelectionChange = (value) => {
    setGender(value);
  };

  const checkEmptyInput = () => {
    if (
      !customer.full_name.trim() ||
      !customer.phone_number.trim() ||
      !customer.username.trim() ||
      !customer.birth_date.trim()
    ) {
      toastWarning("Please fill out all field");
      return true;
    }
    return false;
  };

  const handleEditCustomer = async () => {
    console.log(image)
    if (checkEmptyInput()) return;
    const payload = {
      user_id: session?.customer?.customer_id,
      new_customer: {
        username: customer.username,
        full_name: customer.full_name,
        phone_number: customer.phone_number,
        birth_date: new Date(
          customer.birth_date.split("-").reverse().join("-")
        ).toISOString(),
        male: gender === "Male",
        image: {
          name: image.name,
          url: image.url,
        },
      },
    };
    patchCustomer(payload).then((data) => {
      if (data) {
        console.log(data);
        dispatch(
          updateSession({
            customer: data,
          })
        );
        toastSuccess("Information updated");
      } else {
        toastError("Failed to update information");
      }
    });
  };

  const fetchUser = () => {
    setImage({ name: "user", url: session.customer?.image });
    setCustomer({
      ...session.customer,
      birth_date: formattedDate(session.customer?.birth_date),
    });
    setGender(session.customer?.male ? "Male" : "Female");
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleFirstNameChange = (firstName) => {
    setCustomer((c) => ({
      ...c,
      full_name: `${firstName} ${c.full_name.split(" ").slice(1).join(" ")}`,
    }));
  };

  const handleLastNameChange = (lastName) => {
    setCustomer((c) => ({
      ...c,
      full_name: `${c.full_name.split(" ")[0]} ${lastName}`,
    }));
  };

  const changeImage = ({ name, url }) => {
    setImage({
      name,
      url,
    });
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleImage(files[0], changeImage);
    }
  };

  const handleOpenImage = () => {
    imagePicker.current && imagePicker.current.click();
  };

  return (
    <section className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-col gap-2">
        <div className="text-xl font-semibold">My Profile</div>
        <div className="text-sm opacity-60">
          Manage your personal information
        </div>
      </div>
      <Divider />
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col gap-4 items-center p-4">
          <ProfileImageHolder url={image.url} />
          <button className="button-variant-1" onClick={handleOpenImage}>
            Change photo
          </button>
          <input
            type="file"
            accept="image/"
            className="hidden"
            ref={imagePicker}
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <span className="grid grid-cols-1 md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-x-10 gap-y-4 ">
              <span>Last name</span>
              <InputBox
                value={
                  customer?.full_name
                    ?.split(" ")
                    .filter((_, index) => index !== 0)
                    .join(" ") || ""
                }
                onChange={handleLastNameChange}
              />
            </span>
            <span className="grid grid-cols-1 md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-x-10 gap-y-4 ">
              <span>First name</span>
              <InputBox
                value={customer?.full_name?.split(" ")[0] || ""}
                onChange={handleFirstNameChange}
              />
            </span>
          </div>
          <span className="grid grid-cols-1 md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-x-10 gap-y-4 ">
            <span>Username</span>
            <InputBox
              value={customer?.username || ""}
              onChange={(s) => setCustomer((c) => ({ ...c, username: s }))}
            />
            <span>Phone</span>
            <PhoneInput
              value={customer?.phone_number || ""}
              onChange={(s) => setCustomer((c) => ({ ...c, phone_number: s }))}
            />
            <span>Gender</span>
            <div className="flex flex-row gap-4">
              <label className="flex gap-2 items-center" htmlFor="Male">
                <RadioButton
                  name={"gender"}
                  value={"Male"}
                  checked={gender === "Male"}
                  onChange={handleRadioSelectionChange}
                />
                <span>Male</span>
              </label>
              <label className="flex gap-2 items-center" htmlFor="Female">
                <RadioButton
                  name={"gender"}
                  value={"Female"}
                  checked={gender === "Female"}
                  onChange={handleRadioSelectionChange}
                />
                <span>Female</span>
              </label>
            </div>
          </span>
          <span className="grid grid-rows-[auto_1fr] md:grid-cols-[100px_1fr] md:grid-rows-1 whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-10 ">
            <span>Birth date</span>
            <DatePicker
              value={customer?.birth_date}
              onChange={(s) => setCustomer((c) => ({ ...c, birth_date: s }))}
            />
          </span>
          <div>
            <button
              className="button-variant-1 ml-auto"
              onClick={handleEditCustomer}
            >
              Edit profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
