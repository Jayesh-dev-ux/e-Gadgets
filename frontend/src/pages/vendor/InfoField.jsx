import { motion } from "framer-motion";

const InfoField = ({ label, value }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="bg-gray-50 p-4 rounded-lg"
  >
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base text-gray-800 mt-1">{value}</p>
  </motion.div>
);

export default InfoField;