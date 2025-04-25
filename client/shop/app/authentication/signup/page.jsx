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
import validator from 'validator';


export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [newAccount, setNewAccount] = useState({
    firstname: "",
    lastname: "",
    gender: "Male",
    birthdate: "",
    username: "",
    phonenumber: "",
    email: "",
    password: "",
    repeatpassword: "",
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate fields

    if (
      !newAccount.firstname ||
      !newAccount.lastname ||
      !newAccount.username ||
      !newAccount.phonenumber ||
      !newAccount.email ||
      !newAccount.password ||
      !newAccount.repeatpassword ||
      !newAccount.birthdate
    ) {
      toastWarning("Please fill out all fields!");
      return;
    }
    if (!validator.isEmail(newAccount.email)) {
      toastWarning("Invalid email!");
      return;
    }
    if(newAccount.phonenumber.trim().length!=10) {
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
      account: {
        email: newAccount.email,
        password: newAccount.password,
      },
      username: newAccount.username.trim().replace(" ", "_"),
      full_name: `${newAccount.firstname} ${newAccount.lastname}`,
      phone_number: newAccount.phonenumber,
      male: newAccount.gender === "Male", // Convert "Male" to true, "Female" to false
      birth_date: new Date(newAccount.birthdate.split("-").reverse().join("-")).toISOString(), // Convert DD-MM-YYYY to YYYY-MM-DD
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
        setIsLoading(false)
      }
    } else {
      toastError("Signed up failed! Pleased try again");
      setIsLoading(false)
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
          <div className="flex md:flex-row flex-col gap-10 bg-inherit">
            <InputBox
              value={newAccount.firstname}
              onChange={(v) =>
                setNewAccount((prev) => ({ ...prev, firstname: v }))
              }
              name={"first name"}
            />
            <InputBox
              value={newAccount.lastname}
              onChange={(v) =>
                setNewAccount((prev) => ({ ...prev, lastname: v }))
              }
              name={"last name"}
            />
          </div>
          <div className="flex md:flex-row flex-col gap-10 bg-inherit items-center">
            <div className="flex flex-row gap-4">
              <label className="flex gap-2 items-center" htmlFor="Male">
                <RadioButton
                  name={"gender"}
                  value={"Male"}
                  checked={newAccount.gender === "Male"}
                  onChange={() =>
                    setNewAccount((prev) => ({ ...prev, gender: "Male" }))
                  }
                />
                <span>Male</span>
              </label>
              <label className="flex gap-2 items-center" htmlFor="Female">
                <RadioButton
                  name={"gender"}
                  value={"Female"}
                  checked={newAccount.gender === "Female"}
                  onChange={() =>
                    setNewAccount((prev) => ({ ...prev, gender: "Female" }))
                  }
                />
                <span>Female</span>
              </label>
            </div>
            <DatePicker
              name={"birth date"}
              value={newAccount.birthdate}
              onChange={(v) =>
                setNewAccount((prev) => ({ ...prev, birthdate: v }))
              }
            />
          </div>
          <InputBox
            value={newAccount.username}
            onChange={(v) =>
              setNewAccount((prev) => ({ ...prev, username: v }))
            }
            name={"username"}
          />
          <PhoneInput
            maxLength={10}
            value={newAccount.phonenumber}
            onChange={(v) =>
              setNewAccount((prev) => ({ ...prev, phonenumber: v }))
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
