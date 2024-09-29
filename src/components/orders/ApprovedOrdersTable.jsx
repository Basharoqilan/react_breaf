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

const ApprovedOrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const approvedQuery = query(
        collection(db, "subscriptions"),
        where("status", "in", ["accepted"])
      );
      const approvedSnapshot = await getDocs(approvedQuery);

      const orders = [];
      let orderIdCounter = 1;

      for (const subscriptionDoc of approvedSnapshot.docs) {
        const subscriptionData = subscriptionDoc.data();
        const { userID, courseID, status, ApprovedDate, endDate } =
          subscriptionData;

        const userDoc = await getDoc(doc(db, "users", userID));
        const userData = userDoc.data();

        const courseDoc = await getDoc(doc(db, "courses", courseID));
        const courseData = courseDoc.data();

        // Debugging: Log the ApprovedDate to see its structure
        console.log("ApprovedDate:", ApprovedDate);

        // Safely convert string dates to JavaScript Date objects
        const ApprovedDateFormatted =
          typeof ApprovedDate === "string"
            ? new Date(ApprovedDate).toLocaleDateString()
            : "N/A";

        const endDateFormatted =
          typeof endDate === "string"
            ? new Date(endDate).toLocaleDateString()
            : "N/A";

        // Log to confirm correct handling of ApprovedDate
        console.log("Formatted Approved Date:", ApprovedDateFormatted);

        const order = {
          id: `ORD${String(orderIdCounter).padStart(3, "0")}`,
          subscriptionId: subscriptionDoc.id,
          customer: userData.name,
          total: courseData.total_cost,
          status: status,
          courseName: courseData.course_name,
          ApprovedDate: ApprovedDateFormatted,
          endDate: endDateFormatted,
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
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.courseName.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Approved Orders</h2>
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
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.ApprovedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.endDate}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ApprovedOrdersTable;
