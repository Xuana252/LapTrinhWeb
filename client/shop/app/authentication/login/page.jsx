"use client";
import InputBox from "@components/Input/InputBox";
import PasswordInput from "@components/Input/PasswordInput";
import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { signIn } from "@node_modules/next-auth/react";
import { redirect } from "@node_modules/next/dist/server/api-utils";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import Link from "next/link";
import React, { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginAccount, setLoginAccount] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if(isLoading) return
    if (!loginAccount.email || !loginAccount.password) {
      toastWarning("Please fill out all fields!");
      return;
    }
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: loginAccount.email,
        password: loginAccount.password,
        redirect: false, // Prevent automatic redirect
      });

      if (result?.error) {
        toastError(result?.error)
      } else {
        // Redirect to the desired page after successful sign-in
        toastSuccess('logged in successfully')
        window.location.href = "/"; // Adjust to your desired redirect URL
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false)
  };
  return (
    <div className="flex items-center justify-center">
      <form
        className="max-w-[800px] w-full bg-surface py-8 px-8 flex flex-col gap-14 shadow-lg"
        onSubmit={(e) => handleLogin(e)}
      >
        <h1 className="text-5xl font-bold text-left">Login</h1>

        <div className="flex flex-col gap-10 bg-inherit">
          <InputBox
            name={"email"}
            value={loginAccount.email}
            onChange={(v) => setLoginAccount((la) => ({ ...la, email: v }))}
          />
          <PasswordInput
            name={"password"}
            value={loginAccount.password}
            onChange={(v) => setLoginAccount((la) => ({ ...la, password: v }))}
          />
        </div>
        <button className="button-variant-1">
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            "Login"
          )}
        </button>
        <p className="text-center text-on-surface text-xl">
          Don't have an account?{" "}
          <Link href="/authentication/signup" className="underline font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
