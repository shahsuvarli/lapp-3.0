"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import Image from "next/image";

function Login() {
  const router = useRouter();
  return (
    <div className="flex flex-row gap-8 bg-white border border-slate-200 border-solid px-8 py-4">
      <span className="w-full md:flex justify-center border-r border-r-slate-200 border-solid pr-8 hidden items-center">
        <Image
          src={"/logo.png"}
          height={200}
          width={500}
          priority
          alt="logo"
          className="w-[300px] h-auto object-contain"
        />
      </span>
      <div className="flex flex-col bg-white rounded-md min-w-[350px] min-h-[#400px] gap-4">
        <h1 className="text-slate-600 mb-4 text-center text-2xl">Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("invalid email").required("required"),
            password: Yup.string().required("required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(async () => {
              const response = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
              });

              if (!response?.error) {
                router.push("/");
              }
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting, handleSubmit, values, errors }) => (
            <Form
              className="flex flex-col gap-8 justify-between text-slate-600"
              onSubmit={handleSubmit}
            >
              <div className="w-full flex flex-col gap-2">
                <label
                  className="flex flex-row gap-2 text-md items-center"
                  htmlFor="email"
                >
                  <p className="text-lg">Email</p>
                  <p className="text-red-500">
                    {errors.email ? `(${errors.email})` : ""}
                  </p>
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  id="email"
                  autoComplete="true"
                  className="w-full h-12 border border-solid border-slate-400 box-border p-2 rounded-md"
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <label
                  className="flex flex-row gap-2 text-md items-center"
                  htmlFor="password"
                >
                  <p className="text-lg">Password</p>
                  <p className="text-red-500">
                    {errors.password ? `(${errors.password})` : ""}
                  </p>
                </label>
                <Field
                  required
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full h-12 border border-solid border-slate-400 box-border p-2 rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-md border-none bg-[#0366ff] text-white text-lg hover:cursor-pointer hover:bg-[#0757d0]"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
