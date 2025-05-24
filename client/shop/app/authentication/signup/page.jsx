"use client";
import React, { useState } from "react";
import InputBox from "@components/Input/InputBox";
import Link from "next/link";
import DatePicker from "@components/Input/DatePicker";
import RadioButton from "@components/Input/RadioButton";
import PasswordInput from "@components/Input/PasswordInput";
import PhoneInput from "@components/Input/PhoneInput";
import { singUp } from "@service/customer";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import { signIn } from "@node_modules/next-auth/react";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faSpinner } from "@node_modules/@fortawesome/free-solid-svg-icons";
import validator from "validator";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: "",
    phone_number: "",
    email: "",
    password: "",
    repeatpassword: "",
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate fields

    if (
      !newAccount.username ||
      !newAccount.phone_number ||
      !newAccount.email ||
      !newAccount.password ||
      !newAccount.repeatpassword
    ) {
      toastWarning("Please fill out all fields!");
      return;
    }
    if (!validator.isEmail(newAccount.email)) {
      toastWarning("Invalid email!");
      return;
    }
    if (newAccount.phone_number.trim().length != 10) {
      toastWarning("Phone number must be at least 10 digits long!");
      return;
    }
    if (newAccount.password) {
      if (newAccount.password !== newAccount.repeatpassword) {
        toastWarning("Passwords do not match!");
        return;
      }
      if (newAccount.password.trim().length < 8) {
        toastWarning("Passwords must be at least 8 letters long!");
        return;
      }
    }

    const signUpData = {
      email: newAccount.email,
      password: newAccount.password,
      username: newAccount.username.trim().replace(" ", "_"),
      phone_number: newAccount.phone_number,
    };

    setIsLoading(true);

    const result = await singUp(signUpData);
    if (result) {
      toastSuccess("Signed up successfully ");
      try {
        const result = await signIn("credentials", {
          email: newAccount.email,
          password: newAccount.password,
          redirect: false,
        });

        if (result?.error) {
          console.log(result.error); // Handle errors here
        } else {
          // Redirect to the desired page after successful sign-in
          window.location.href = "/"; // Adjust to your desired redirect URL
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    } else {
      toastError("Signed up failed! Pleased try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        className="max-w-[800px] w-full bg-surface py-8 px-8 flex flex-col gap-14 shadow-lg"
        onSubmit={handleSignUp}
      >
        <h1 className="text-5xl font-bold text-right">Sign up</h1>

        <div className="flex flex-col gap-10 bg-inherit">
          <InputBox
            value={newAccount.username}
            onChange={(v) =>
              setNewAccount((prev) => ({ ...prev, username: v }))
            }
            name={"username"}
          />
          <PhoneInput
            maxLength={10}
            value={newAccount.phone_number}
            onChange={(v) =>
              setNewAccount((prev) => ({ ...prev, phone_number: v }))
            }
            name={"phone number"}
          />
          <InputBox
            value={newAccount.email}
            onChange={(v) => setNewAccount((prev) => ({ ...prev, email: v }))}
            name={"email"}
          />
          <PasswordInput
            value={newAccount.password}
            onChange={(v) =>
              setNewAccount((prev) => ({ ...prev, password: v }))
            }
            name={"password"}
          />
          <PasswordInput
            value={newAccount.repeatpassword}
            onChange={(v) =>
              setNewAccount((prev) => ({ ...prev, repeatpassword: v }))
            }
            name={"repeat password"}
          />
        </div>
        <button type="submit" className="button-variant-1 text-2xl">
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            "Sign up"
          )}
        </button>
        <p className="text-center text-on-surface text-xl">
          Already have an account?{" "}
          <Link href="/authentication/login" className="underline font-bold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
