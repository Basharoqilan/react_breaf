import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase"; // Replace with your Firebase configuration
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
      setFilteredUsers(userList); // Initially set filtered users to all users
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setCurrentUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, currentUser);
    setUsers(
      users.map((user) => (user.id === currentUser.id ? currentUser : user))
    );
    setFilteredUsers(
      filteredUsers.map((user) =>
        user.id === currentUser.id ? currentUser : user
      )
    );
    setIsEditing(false);
  };

  const handleAddUser = async () => {
    try {
      // First, create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password // Password should be hashed in the backend, but this is handled by Firebase
      );
      const userAuth = userCredential.user;

      // Now add the user data to Firestore with the UID from auth
      const docRef = await addDoc(collection(db, "users"), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        uid: userAuth.uid, // Save the UID in Firestore for future reference
      });

      // Update state after adding
      setUsers([...users, { id: docRef.id, ...newUser, uid: userAuth.uid }]);
      setFilteredUsers([
        ...filteredUsers,
        { id: docRef.id, ...newUser, uid: userAuth.uid },
      ]);

      // Reset form
      setIsAdding(false);
      setNewUser({ name: "", email: "", role: "", phone: "", password: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDelete = async (id) => {
    // Find the user document in Firestore to retrieve their UID
    const userDoc = users.find((user) => user.id === id);

    try {
      // Delete from Firestore
      const userRef = doc(db, "users", id);
      await deleteDoc(userRef);

      // Delete from Firebase Authentication
      const userAuth = auth.currentUser;
      if (userAuth && userAuth.uid === userDoc.uid) {
        await deleteUser(userAuth);
      }

      // Update state after deletion
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setIsAdding(false);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="flex items-center">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-4"
            onClick={() => setIsAdding(true)}
          >
            {" "}
            Add User{" "}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>
      <p className="text-gray-300 mb-4">Total Users: {users.length}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-blue-100 ${
                      user.role === "admin"
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">{user.phone}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditing && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <motion.div
            className="bg-gray-900 text-white rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={currentUser.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <label className="block mt-4 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <label className="block mt-4 mb-2">Role:</label>
            <input
              type="text"
              name="role"
              value={currentUser.role}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <label className="block mt-4 mb-2">Phone:</label>
            <input
              type="text"
              name="phone"
              value={currentUser.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="mt-4 ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={handleClose}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <motion.div
            className="bg-gray-900 text-white rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Add User</h2>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <label className="block mt-4 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <label className="block mt-4 mb-2">Role:</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label className="block mt-4 mb-2">Phone:</label>
            <input
              type="text"
              name="phone"
              value={newUser.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <label className="block mt-4 mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={handleAddUser}
            >
              Add User
            </button>
            <button
              className="mt-4 ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTable;
