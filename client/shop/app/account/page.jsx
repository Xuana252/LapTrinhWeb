"use client";
import DatePicker from "@components/Input/DatePicker";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import Divider from "@components/UI/Layout/Divider";
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
import { upload } from "@util/generator/uploader";

const Account = () => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const fetchFlag = useRef(true);
  const [customer, setCustomer] = useState();
  const [image, setImage] = useState({ name: "", url: "" });
  const imagePicker = useRef(null);

  const checkEmptyInput = () => {
    if (!customer.phone_number.trim() || !customer.username.trim()) {
      toastWarning("Please fill out all field");
      return true;
    }
    return false;
  };

  const handleEditCustomer = async () => {
    if (!session?.customer?._id) return;
    if (checkEmptyInput()) return;
    const imageUrl = await upload(image.url, session?.customer?._id);
    const payload = {
      username: customer.username,
      phone_number: customer.phone_number,
      image: imageUrl,
    };
    patchCustomer(session.customer._id, payload).then((data) => {
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
    getCustomer(session?.customer?._id).then((data) => {
      if (data) {
        setImage({ name: data._id, url: data.image });
        setCustomer(data);
      }
    });
  };

  useEffect(() => {
    if(fetchFlag.current && session?.customer?._id) {
      fetchUser();
      fetchFlag.current = false
    }
  }, [session]);

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
      <div className="flex flex-col">
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
          <span className="grid grid-cols-1 md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-x-10 gap-y-4 ">
            <span>Username</span>
            <InputBox
              value={customer?.username || ""}
              onChange={(s) => setCustomer((c) => ({ ...c, username: s }))}
            />
            <span>Phone number</span>
            <PhoneInput
              value={customer?.phone_number || ""}
              onChange={(s) => setCustomer((c) => ({ ...c, phone_number: s }))}
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
