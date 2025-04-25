"use client";
import PasswordInput from "@components/Input/PasswordInput";
import Divider from "@components/UI/Divider";
import { changePassword, patchAccount } from "@service/account";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import React, { useState } from "react";
import { useDispatch, useSelector } from "@node_modules/react-redux/dist/react-redux";
import { signOut } from "@node_modules/next-auth/react";
import { clearOrder, setOrderStateAsync } from "@provider/redux/order/orderSlice";

const ChangePassword = () => {
  const dispatch = useDispatch()
  const session = useSelector((state) => state.session);
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const checkEmptyInput = () => {
    if (
      !password.current_password.trim() ||
      !password.new_password.trim() ||
      !password.confirm_password.trim()
    ) {
      toastWarning("Please fill out all field");
      return true;
    }
    return false;
  };

  const validateNewPassword = () => {
    if (password.new_password.trim() !== password.confirm_password.trim()) {
      toastWarning("New passwords don't match");
      return false;
    } else if (password.new_password.trim().length < 8) {
      toastWarning("New password must be at least 8 letters long");
      return false;
    }
    return true;
  };

  
  const handleSignOut = async () => {
    dispatch(clearOrder());
    await dispatch(setOrderStateAsync(0)); // Reset Redux state

    signOut()
}


  const handleChangePassword =  async () => {
    if (checkEmptyInput()) return;
    if (!validateNewPassword()) return;


    const payload = {
      account_id: session.customer.account_id,
      currentPassword: password.current_password,
      newPassword: password.new_password,
    };
    changePassword(payload).then((data) => {
      if (data.status) {
        toastSuccess(data.message);
        handleSignOut();
      } else {
        toastError(data.message);
      }
    });
  };
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Change password</div>
        <div className="text-sm opacity-60">Change your account password</div>
      </div>
      <Divider />
      <div className="flex justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-4 whitespace-nowrap w-fit h-fit">
          <span>
            <h2>Current password</h2>
          </span>
          <PasswordInput
            value={password.current_password}
            onChange={(t) =>
              setPassword((p) => ({ ...p, current_password: t }))
            }
          />
          <span>
            <h2>New password</h2>
          </span>
          <PasswordInput
            value={password.new_password}
            onChange={(t) => setPassword((p) => ({ ...p, new_password: t }))}
          />
          <span>
            <h2>Confirm password</h2>
          </span>
          <PasswordInput
            value={password.confirm_password}
            onChange={(t) => setPassword((p) => ({ ...p, confirm_password: t }))}
          />
          <button
            className="button-variant-1  md:col-span-2"
            onClick={handleChangePassword}
          >
            Change password
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
