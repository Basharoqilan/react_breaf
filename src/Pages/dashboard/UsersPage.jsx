import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import UsersTable from "../../components/users/UsersTable";
import UserGrowthChart from "../../components/users/UserGrowthChart";
import UserActivityHeatmap from "../../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../../components/users/UserDemographicsChart";

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
};

const UsersPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Users" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}

        <UsersTable />
      </main>
    </div>
  );
};
export default UsersPage;
