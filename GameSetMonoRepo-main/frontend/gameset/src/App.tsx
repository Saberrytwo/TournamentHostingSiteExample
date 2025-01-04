import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useCreateUserOnLogin, useFetchUser } from "../src/hooks/hooks";
import "./App.css";
import { Routes } from "./routes";

function App() {
  useFetchUser();
  useCreateUserOnLogin();
  const router = createBrowserRouter(Routes());

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
