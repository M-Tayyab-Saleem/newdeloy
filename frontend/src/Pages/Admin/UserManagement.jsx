import React, { useState, useEffect } from "react";
import CreateUserModal from "../../Components/CreateUserModal";
import CreateDepartmentModal from "../../Components/CreateDepartmentModal";
import UserManagementTable from "../../Components/UserManagementTable";
import { FaPlus, FaSearch, FaSortDown } from "react-icons/fa";
import UserDetailModal from "../../Components/UserDetailModal";
import api from "../../axios";
import { toast } from "react-toastify";
import PageContainer from "../../Components/ui/PageContainer";
import GlassInput from "../../Components/ui/GlassInput";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, deptsRes, meRes] = await Promise.all([
        api.get("/users"),
        api.get("/departments"),
        api.get("/auth/me"),
      ]);

      const usersArray = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.data || [];

      setUsers(usersArray);
      setDepartments(deptsRes.data);
      setCurrentUser(meRes.data.user);
      setFilteredUsers(usersArray);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.empID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "department") {
          aValue = a.department?.name || "";
          bValue = b.department?.name || "";
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(result);
  }, [searchTerm, users, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const handleUserCreated = () => {
    fetchData();
    toast.success("User created successfully");
  };

  const handleDepartmentCreated = () => {
    fetchData();
    toast.success("Department created successfully");
  };

  const handleUserUpdated = (type = "update") => {
    fetchData();
    toast.success(type === "delete" ? "User deleted successfully" : "User updated successfully");
  };

  const activeUsers = users.filter((u) => u.empStatus === "Active").length;
  const inactiveUsers = users.filter((u) => u.empStatus === "Inactive").length;

  const canAddUser = currentUser && ["Super Admin", "Admin"].includes(currentUser.role);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <PageContainer
        title="User Management"
        subtitle="Manage users, roles, and permissions"
        loading={loading}
        headerActions={
          <>
            {canAddUser && (
              <button
                onClick={() => setIsDeptModalOpen(true)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <FaPlus className="text-xs" /> Add Department
              </button>
            )}
            {canAddUser && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <FaPlus className="text-xs" /> Add User
              </button>
            )}
          </>
        }
        filters={
          <>
            <GlassInput
              placeholder="Search by name, email, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {["name", "department", "role", "empStatus", "hourlyWage"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${sortConfig.key === key
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30"
                      : "bg-surface text-muted hover:bg-hover border border-border-subtle"
                    }`}
                >
                  {key === "empStatus" ? "Status" : key === "hourlyWage" ? "Wage" : key}
                  {sortConfig.key === key && (
                    <FaSortDown className={`inline ml-1 ${sortConfig.direction === "desc" ? "rotate-180" : ""}`} />
                  )}
                </button>
              ))}
            </div>
          </>
        }
        bottomWidgets={
          <div className="flex justify-between text-xs font-bold uppercase tracking-wide px-2">
            <span className="text-muted">Active: <span className="text-main">{activeUsers}</span></span>
            <span className="text-muted">Inactive: <span className="text-main">{inactiveUsers}</span></span>
            <span className="text-muted">Total Users: <span className="text-main">{users.length}</span></span>
          </div>
        }
      >
        <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] overflow-hidden">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-white/60 to-white/40 border-b border-border-subtle shadow-sm">
                {["ID", "Name", "Email", "Department", "Role", "Wage", "Status"].map((h) => (
                  <th
                    key={h}
                    className="p-4 text-[11px] font-black text-heading uppercase tracking-widest cursor-pointer hover:bg-white/30 transition-colors"
                    onClick={() => handleSort(h === "Wage" ? "hourlyWage" : h.toLowerCase())}
                  >
                  {h}
                  {sortConfig.key === (h === "Wage" ? "hourlyWage" : h.toLowerCase()) && (
                    <FaSortDown className={`inline ml-1 ${sortConfig.direction === "desc" ? "rotate-180" : ""}`} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="hover:bg-white/40 dark:hover:bg-black/20 cursor-pointer transition-colors"
              >
                <td className="p-4 text-sm font-medium text-muted">#{user.empID}</td>
                <td className="p-4 text-sm font-bold text-main">{user.name}</td>
                <td className="p-4 text-sm font-medium text-muted">{user.email}</td>
                <td className="p-4 text-xs font-semibold bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-md border border-border-subtle text-main">
                  {user.department?.name || "-"}
                </td>
                <td className="p-4">
                  <span className="bg-brand/10 text-brand border border-brand/20 px-2.5 py-1 rounded-full text-xs font-bold">
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-main">
                  {user.hourlyWage ? `$${user.hourlyWage}` : "-"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${user.empStatus === "Active"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                      }`}
                  >
                    {user.empStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </PageContainer>

      <CreateUserModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onUserCreated={handleUserCreated}
        allDepartments={departments}
        allManagers={users}
      />

      <UserDetailModal
        user={selectedUser}
        currentUser={currentUser}
        isOpen={isUserDetailOpen}
        onClose={() => {
          setIsUserDetailOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
        allManagers={users}
        allDepartments={departments}
      />
      <CreateDepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onDepartmentCreated={handleDepartmentCreated}
        potentialManagers={users}
      />
    </>
  );
};

export default UserManagement;