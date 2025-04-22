import { useEffect, useState } from "react";
import VendorNavbar from "./vendor/VendorNavbar";
import UserNavbar from "../components/Navbar"; // Adjust import if needed

const NavbarLoader = ({ activeTab, setActiveTab }) => {
  const [navbarType, setNavbarType] = useState(null); // 'user', 'vendor', or null

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const vendorToken = localStorage.getItem("vendorToken");

    if (vendorToken && !userInfo) {
      setNavbarType("vendor");
    } else if (userInfo && !vendorToken) {
      setNavbarType("user");
    } else {
      setNavbarType("user"); // No one logged in
    }
  }, []);

  if (navbarType === "vendor") {
    return <VendorNavbar activeTab={activeTab} setActiveTab={setActiveTab} />;
  } else if (navbarType === "user") {
    return <UserNavbar />;
  } else {
    return null; // or show a simple guest navbar
  }
};

export default NavbarLoader;
