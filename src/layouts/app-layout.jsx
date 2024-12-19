// /
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-black mt-10">
        {" "}
        Made by{" "}
        <span className="text-red-500 text-xl">
          Parth Dwivedi and Haseeb Ali.{" "}
        </span>
        <br /> &copy; 2021 Hirred Inc. All rights reserved.
      </div>
    </div>
  );
};

export default AppLayout;
