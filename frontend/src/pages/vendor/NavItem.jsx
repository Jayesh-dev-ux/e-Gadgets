import { motion } from "framer-motion";

const NavItem = ({ icon, text, active, onClick }) => (
  <motion.button
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center w-full px-6 py-3 ${
      active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
    } transition-colors`}
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </motion.button>
);

export default NavItem;