import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Get all orders
// export const getOrders = async (orderId) => {
//   try {
//     const response = await axios.get(API_URL, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("userInfo")?.token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching orders:", error.response?.data?.message || error.message);
//     return [];
//   }
// };

export const getOrders = async (orderId) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // ✅ Parse the JSON string
    const token = userInfo?.token;
    if (!token) {
      throw new Error("Token not found or user not authenticated");
    }

    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - Please log in again");
      // Optionally, redirect user to login page or clear localStorage
    } else {
      console.error("Error fetching orders:", error.response?.data?.message || error.message);
    }
    return [];
  }
};


// Create a new order
// export const createOrder = async (orderData) => {
//   try {
//     const response = await axios.post(API_URL, orderData, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("userInfo")?.token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating order:", error.response?.data?.message || error.message);
//     return null;
//   }
// };

export const createOrder = async (orderData) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // ✅ Parse the JSON string
    const token = userInfo?.token;

    const response = await axios.post(API_URL, orderData, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Send token correctly
    });

    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response?.data?.message || error.message);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("userInfo")?.token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error.response?.data?.message || error.message);
    return null;
  }
};
