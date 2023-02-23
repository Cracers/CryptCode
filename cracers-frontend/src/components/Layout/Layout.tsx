import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer/Footer";
import { Toaster } from "react-hot-toast";
type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <Header />
      <div className="main-content">{children}</div>
      {/* <Footer /> */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Default options for specific types
          success: {
            duration: 2500,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 5000,
          },
        }}
      />
    </div>
  );
};

export default Layout;
