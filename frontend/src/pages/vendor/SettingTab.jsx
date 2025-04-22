import { motion } from "framer-motion";
import InfoField from "./InfoField";

const SettingsTab = ({ vendor }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
      Account Settings
    </h2>
    <div className="bg-gray-50 rounded-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Name" value={vendor?.name} />
        <InfoField label="Email" value={vendor?.email} />
        <InfoField label="Company" value={vendor?.companyName} />
        <InfoField label="Business Type" value={vendor?.businessType} />
      </div>
    </div>
  </motion.div>
);

export default SettingsTab;