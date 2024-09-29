import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Assuming you have your firebaseConfig here
import { format, addDays } from "date-fns"; // Date manipulation library

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  // Fetch orders from the Firestore database
  useEffect(() => {
    const fetchOrders = async () => {
      // Step 1: Get pending subscriptions from Firestore
      const subscriptionsQuery = query(
        collection(db, "subscriptions"),
        where("status", "==", "pending")
      );
      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);

      const orders = [];

      // Step 2: Loop through each subscription and get the user and course details
      let orderIdCounter = 1;
      for (const subscriptionDoc of subscriptionsSnapshot.docs) {
        const subscriptionData = subscriptionDoc.data();
        const { userID, courseID, status } = subscriptionData;

        // Get user data
        const userDoc = await getDoc(doc(db, "users", userID));
        const userData = userDoc.data();

        // Get course data
        const courseDoc = await getDoc(doc(db, "courses", courseID));
        const courseData = courseDoc.data();

        // Step 3: Prepare order data
        const order = {
          id: `ORD${String(orderIdCounter).padStart(3, "0")}`, // Auto-incremented order ID
          subscriptionId: subscriptionDoc.id, // Store the subscription ID for document update
          customer: userData.name,
          total: courseData.total_cost,
          status: status,
          courseName: courseData.course_name,
          courseDuration: courseData.course_duration, // in days
          approvedDate: null, // Initially null
          endDate: null, // Initially null
        };

        orders.push(order);
        orderIdCounter++;
      }

      setOrdersData(orders);
      setFilteredOrders(orders); // Initially set filtered orders to all orders
    };

    fetchOrders();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ordersData.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.courseName.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  // Handle approve action
  // Handle approve action
  const handleApprove = async (subscriptionId, courseDuration) => {
    const currentDate = new Date();
    const approvedDate = format(currentDate, "yyyy-MM-dd");

    // Ensure courseDuration is treated as an integer
    const durationInDays = parseInt(courseDuration, 10) || 0; // Use 0 if parsing fails
    const endDate = format(addDays(currentDate, durationInDays), "yyyy-MM-dd");

    // Step 1: Update the subscription document in Firestore
    const subscriptionRef = doc(db, "subscriptions", subscriptionId);
    await updateDoc(subscriptionRef, {
      ApprovedDate: approvedDate,
      endDate: endDate,
      status: "accepted", // Update status to Approved
    });

    // Step 2: Update local state to re-render the table
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.subscriptionId === subscriptionId
          ? {
              ...order,
              status: "Approved",
              approvedDate: approvedDate,
              endDate: endDate,
            }
          : order
      )
    );
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.subscriptionId === subscriptionId
          ? {
              ...order,
              status: "Approved",
              approvedDate: approvedDate,
              endDate: endDate,
            }
          : order
      )
    );
  };

  // Handle reject action
  const handleReject = async (subscriptionId) => {
    // Step 1: Update the subscription status to "rejected" in Firestore
    const subscriptionRef = doc(db, "subscriptions", subscriptionId);
    await updateDoc(subscriptionRef, {
      status: "rejected", // Set status to rejected
    });

    // Step 2: Update local state to re-render the table
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.subscriptionId === subscriptionId
          ? { ...order, status: "rejected" }
          : order
      )
    );
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.subscriptionId === subscriptionId
          ? { ...order, status: "rejected" }
          : order
      )
    );
  };

  // Handle expire action
  const handleExpire = async (subscriptionId) => {
    // Step 1: Update the subscription status to "expired" in Firestore
    const subscriptionRef = doc(db, "subscriptions", subscriptionId);
    await updateDoc(subscriptionRef, {
      status: "expired", // Set status to expired
    });

    // Step 2: Update local state to re-render the table
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.subscriptionId === subscriptionId
          ? { ...order, status: "expired" }
          : order
      )
    );
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.subscriptionId === subscriptionId
          ? { ...order, status: "expired" }
          : order
      )
    );
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Approved Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : order.status === "expired"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.approvedDate ? order.approvedDate : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.endDate ? order.endDate : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-green-400 hover:text-green-300 mr-2"
                    onClick={() =>
                      handleApprove(order.subscriptionId, order.courseDuration)
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 mr-2"
                    onClick={() => handleReject(order.subscriptionId)}
                  >
                    Reject
                  </button>
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={() => handleExpire(order.subscriptionId)}
                  >
                    Expire
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdersTable;
