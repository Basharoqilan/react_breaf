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
} from "firebase/firestore";
import { db } from "../../firebase";

const ExpiredOrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const subscriptionsQuery = query(
        collection(db, "subscriptions"),
        where("status", "==", "expired")
      );
      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
      const orders = [];

      let orderIdCounter = 1;
      for (const subscriptionDoc of subscriptionsSnapshot.docs) {
        const subscriptionData = subscriptionDoc.data();
        const { userID, courseID } = subscriptionData;

        const userDoc = await getDoc(doc(db, "users", userID));
        const userData = userDoc.data();

        const courseDoc = await getDoc(doc(db, "courses", courseID));
        const courseData = courseDoc.data();

        const order = {
          id: `ORD${String(orderIdCounter).padStart(3, "0")}`,
          customer: userData.name,
          total: courseData.total_cost,
          status: subscriptionData.status,
          approvedDate: subscriptionData.ApprovedDate,
          endDate: subscriptionData.endDate,
        };
        orders.push(order);
        orderIdCounter++;
      }

      setOrdersData(orders);
      setFilteredOrders(orders);
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ordersData.filter(
      (order) =>
        order.customer.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Expired Orders</h2>
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Approved Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.approvedDate}</td>
                <td>{order.endDate}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ExpiredOrdersTable;
