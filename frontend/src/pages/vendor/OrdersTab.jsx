// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FiPackage, FiTruck, FiCheckCircle, FiDollarSign, FiUser } from "react-icons/fi";
// import { toast } from "react-toastify";

// const OrdersTab = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // "all", "processing", "shipped", "delivered"

//   useEffect(() => {
//     const fetchVendorOrders = async () => {
//       try {
//         const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
//         if (!vendorInfo) {
//           throw new Error("Vendor not authenticated");
//         }

//         const response = await axios.get(
//           `http://localhost:5000/api/orders`,
//           {
//             headers: {
//               Authorization: `Bearer ${vendorInfo.token}`,
//             },
//           }
//         );
//         console.log(response)  
//         const formattedOrders = response.data.map(order => ({
//           ...order,
//           formattedDate: new Date(order.createdAt).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//           formattedTotal: order.totalAmount.toFixed(2),
//           statusSteps: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
//           currentStep: ["Processing", "Shipped", "Out for Delivery", "Delivered"].indexOf(order.status),
//           shortId: order._id.slice(-6).toUpperCase()
//         }));

//         setOrders(formattedOrders);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         toast.error(error.response?.data?.message || "Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVendorOrders();
//   }, []);

//   const filteredOrders = filter === "all" 
//     ? orders 
//     : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
//       await axios.put(
//         `http://localhost:5000/api/orders/${orderId}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${vendorInfo.token}`,
//           },
//         }
//       );

//       setOrders(orders.map(order => 
//         order._id === orderId ? { ...order, status: newStatus } : order
//       ));
//       toast.success("Order status updated");
//     } catch (error) {
//       toast.error("Failed to update order status");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen py-10 px-6">
//       <div className="container mx-auto">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 mb-6 text-center"
//         >
//           Vendor Order Management
//         </motion.h1>

//         {/* Filter Controls */}
//         <motion.div 
//           className="flex flex-wrap gap-2 mb-6 justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           {["all", "processing", "shipped", "delivered"].map((filterOption) => (
//             <button
//               key={filterOption}
//               onClick={() => setFilter(filterOption)}
//               className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
//                 filter === filterOption
//                   ? "bg-blue-500 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               {filterOption}
//             </button>
//           ))}
//         </motion.div>

//         {filteredOrders.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center bg-white p-6 rounded-lg shadow"
//           >
//             <p className="text-gray-500">No {filter === "all" ? "" : filter} orders found</p>
//           </motion.div>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => (
//               <motion.div
//                 key={order._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-white p-6 rounded-lg shadow-md"
//               >
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
//                   <div>
//                     <h2 className="text-lg font-semibold">Order #{order.shortId}</h2>
//                     <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
//                       <FiUser className="text-blue-500" />
//                       <span>Customer: {order.user?.name || "Unknown"}</span>
//                     </div>
//                     <p className="text-sm text-gray-600">Placed on {order.formattedDate}</p>
//                   </div>
//                   <div className="flex flex-col items-end">
//                     <div className="flex items-center gap-2">
//                       <FiDollarSign className="text-green-500" />
//                       <span className="text-lg font-bold text-blue-600">${order.formattedTotal}</span>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
//                       order.status === "Delivered" ? "bg-green-100 text-green-800" :
//                       order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
//                       "bg-blue-100 text-blue-800"
//                     }`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Status Timeline with Action Buttons */}
//                 <div className="mt-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Progress</h3>
//                   <div className="relative">
//                     <div className="absolute h-1 bg-gray-200 top-5 left-0 right-0 -z-10"></div>
//                     <div 
//                       className="absolute h-1 bg-blue-500 top-5 left-0 -z-10"
//                       style={{ width: `${(order.currentStep / (order.statusSteps.length - 1)) * 100}%` }}
//                     ></div>
//                     <div className="flex justify-between">
//                       {order.statusSteps.map((step, index) => (
//                         <div key={index} className="flex flex-col items-center">
//                           <motion.div
//                             className={`w-10 h-10 flex items-center justify-center rounded-full ${
//                               index <= order.currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
//                             }`}
//                             whileHover={{ scale: 1.1 }}
//                           >
//                             {index === 0 ? <FiPackage /> : index === 3 ? <FiCheckCircle /> : <FiTruck />}
//                           </motion.div>
//                           <p className={`mt-2 text-sm font-medium ${
//                             index <= order.currentStep ? "text-blue-600" : "text-gray-500"
//                           }`}>
//                             {step}
//                           </p>
//                           {index <= order.currentStep && (
//                             <button
//                               onClick={() => {
//                                 const nextStatus = order.statusSteps[index + 1];
//                                 if (nextStatus) {
//                                   updateOrderStatus(order._id, nextStatus);
//                                 }
//                               }}
//                               className={`mt-2 px-3 py-1 text-xs rounded-full ${
//                                 index === order.currentStep
//                                   ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                                   : "bg-gray-100 text-gray-500 cursor-not-allowed"
//                               }`}
//                               disabled={index !== order.currentStep}
//                             >
//                               {index === order.currentStep ? "Mark as " + order.statusSteps[index + 1] : "Completed"}
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="mt-6">
//                   <h4 className="font-medium text-gray-800 mb-2">Products:</h4>
//                   <div className="space-y-3">
//                     {order.products.map((product, idx) => (
//                       <div key={idx} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
//                         <img 
//                           src={product.image} 
//                           alt={product.product?.name} 
//                           className="w-12 h-12 object-contain rounded"
//                         />
//                         <div className="flex-1">
//                           <p className="font-medium">{product.product?.name || "Product"}</p>
//                           <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
//                         </div>
//                         {/* <p className="font-medium">${product.price.toFixed(2)}</p> */}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrdersTab;



import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPackage, FiTruck, FiCheckCircle, FiDollarSign, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "processing", "shipped", "delivered"

  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
       

        const response = await axios.get(
          `http://localhost:5000/api/orders`
         
        );
        console.log(response)  
        const formattedOrders = response.data.map(order => ({
          ...order,
          formattedDate: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          formattedTotal: order.totalAmount.toFixed(2),
          statusSteps: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
          currentStep: ["Processing", "Shipped", "Out for Delivery", "Delivered"].indexOf(order.status),
          shortId: order._id.slice(-6).toUpperCase()
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, []);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
      
      // Call the backend API to update order status
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${vendorInfo.token}`,
          },
        }
      );

      // Update the local state with the new order status
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              currentStep: ["Processing", "Shipped", "Out for Delivery", "Delivered"].indexOf(newStatus)
            } 
          : order
      ));
      
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
        >
          Vendor Order Management
        </motion.h1>

        {/* Filter Controls */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {["all", "processing", "shipped", "delivered"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                filter === filterOption
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filterOption}
            </button>
          ))}
        </motion.div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-white p-6 rounded-lg shadow"
          >
            <p className="text-gray-500">No {filter === "all" ? "" : filter} orders found</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.shortId}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <FiUser className="text-blue-500" />
                      <span>Customer: {order.user?.name || "Unknown"}</span>
                    </div>
                    <p className="text-sm text-gray-600">Placed on {order.formattedDate}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-green-500" />
                      <span className="text-lg font-bold text-blue-600">${order.formattedTotal}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Status Timeline with Action Buttons */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Progress</h3>
                  <div className="relative">
                    <div className="absolute h-1 bg-gray-200 top-5 left-0 right-0 -z-10"></div>
                    <div 
                      className="absolute h-1 bg-blue-500 top-5 left-0 -z-10"
                      style={{ width: `${(order.currentStep / (order.statusSteps.length - 1)) * 100}%` }}
                    ></div>
                    <div className="flex justify-between">
                      {order.statusSteps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <motion.div
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${
                              index <= order.currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {index === 0 ? <FiPackage /> : index === 3 ? <FiCheckCircle /> : <FiTruck />}
                          </motion.div>
                          <p className={`mt-2 text-sm font-medium ${
                            index <= order.currentStep ? "text-blue-600" : "text-gray-500"
                          }`}>
                            {step}
                          </p>
                          {index <= order.currentStep && (
                            <button
                              onClick={() => {
                                const nextStatus = order.statusSteps[index + 1];
                                if (nextStatus) {
                                  updateOrderStatus(order._id, nextStatus);
                                }
                              }}
                              className={`mt-2 px-3 py-1 text-xs rounded-full ${
                                index === order.currentStep
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={index !== order.currentStep}
                            >
                              {index === order.currentStep ? "Mark as " + order.statusSteps[index + 1] : "Completed"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-2">Products:</h4>
                  <div className="space-y-3">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                        <img 
                          src={product.image} 
                          alt={product.product?.name} 
                          className="w-12 h-12 object-contain rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.product?.name || "Product"}</p>
                          <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                        </div>
                        {/* <p className="font-medium">${product.price.toFixed(2)}</p> */}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;