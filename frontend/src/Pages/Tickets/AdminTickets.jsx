import React, { useState, useEffect } from "react";
import { Search, Clock, Filter, SortDesc, Plus } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import AdminRaiseTicketModal from "../../Pages/Tickets/RaiseTicketModal";
import { Spin } from "antd";
import ModernSelect from "../../Components/ui/ModernSelect";
import PageContainer from "../../Components/ui/PageContainer";
import GlassInput from "../../Components/ui/GlassInput";
import GlassSelect from "../../Components/ui/GlassSelect";

const AdminTickets = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tickets/all");
        setTickets(res.data || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleNewTicketSubmit = (newTicket) => {
    setTickets((prev) => [...prev, newTicket]);
    setShowModal(false);
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: res.data.status } : ticket
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePriorityChange = async (ticketId, newPriority) => {
    try {
      await api.patch(`/tickets/${ticketId}/priority`, { priority: newPriority });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket
        )
      );
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  return (
    <>
    <PageContainer
      title="Tickets Management"
      subtitle="Manage and assign support tickets"
      loading={loading}
      headerActions={
        <div className="flex items-center gap-2">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterOpen(!filterOpen);
                setSortOpen(false);
              }}
              className="p-2 rounded-lg bg-surface text-muted hover:bg-hover border border-border-subtle transition shadow-sm"
              title="Filter"
            >
              <Filter className="h-4 w-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg z-20">
                <button className="block w-full text-left px-4 py-2 text-sm text-main hover:bg-surface/50 transition">
                  High Priority
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-main hover:bg-surface/50 transition">
                  Low Priority
                </button>
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSortOpen(!sortOpen);
                setFilterOpen(false);
              }}
              className="p-2 rounded-lg bg-surface text-muted hover:bg-hover border border-border-subtle transition shadow-sm"
              title="Sort"
            >
              <SortDesc className="h-4 w-4" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg z-20">
                <button className="block w-full text-left px-4 py-2 text-sm text-main hover:bg-surface/50 transition">
                  Newest First
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-main hover:bg-surface/50 transition">
                  Oldest First
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </button>
        </div>
      }
      filters={
        <>
          <GlassInput
            placeholder="Search tickets by subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <GlassSelect
            label="Show"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            options={[
              { value: 10, label: "10 entries" },
              { value: 25, label: "25 entries" },
              { value: 50, label: "50 entries" }
            ]}
          />
        </>
      }
    >
      <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] overflow-hidden">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-white/60 to-white/40 border-b border-border-subtle shadow-sm">
              <th className="p-4 text-[11px] font-black text-heading uppercase tracking-widest text-left w-[35%]">
                Ticket Details
              </th>
              <th className="p-4 text-[11px] font-black text-heading uppercase tracking-widest text-left w-[20%]">
                Raised By
              </th>
              <th className="p-4 text-[11px] font-black text-heading uppercase tracking-widest text-left w-[15%]">
                Assignee
              </th>
              <th className="p-4 text-[11px] font-black text-heading uppercase tracking-widest text-right w-[30%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
                {filteredTickets.length > 0 ? (
                  filteredTickets.slice(0, entriesPerPage).map((ticket, index) => (
                    <tr key={index} className="border-b border-border-subtle hover:bg-surface/50 transition-colors">
                      {/* Ticket Info */}
                      <td className="p-3 align-top">
                        <div className="font-medium text-heading text-sm">{ticket.subject}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs text-muted font-mono">
                            #{ticket.ticketID || ticket._id?.slice(0, 6)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide 
                              ${ticket.status === "opened"
                              ? "bg-green-100 text-green-800"
                              : ticket.status === "in progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide 
                              ${ticket.priority === "High Priority"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "Medium Priority"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                            {ticket.priority}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted">
                            <Clock className="w-3 h-3" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Raised By */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {ticket.closedBy?.avatar ? (
                            <img src={ticket.closedBy.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <FaUserCircle className="text-muted w-6 h-6" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-xs text-main font-medium whitespace-nowrap">
                              {ticket.closedBy?.name || "Unknown User"}
                            </span>
                            <span className="text-[10px] text-muted truncate max-w-[120px]" title={ticket.emailAddress}>
                              {ticket.emailAddress}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="p-3">
                        {ticket.assignedTo ? (
                          <div className="flex items-center gap-2">
                            {ticket.assignedTo.avatar ? (
                              <img src={ticket.assignedTo.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <FaUserCircle className="text-muted w-6 h-6" />
                            )}
                            <div className="flex flex-col">
                              <span className="text-xs text-main font-medium whitespace-nowrap">
                                {ticket.assignedTo.name || "Unknown Name"}
                              </span>
                              {ticket.assignedTo.email && (
                                <span className="text-[10px] text-muted truncate max-w-[120px]" title={ticket.assignedTo.email}>
                                  {ticket.assignedTo.email}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center border border-border-subtle">
                              <FaUserCircle className="text-slate-300 w-4 h-4" />
                            </div>
                            <span className="text-xs text-muted italic">Unassigned</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {/* Status Dropdown */}
                          <div className="w-32">
                            <ModernSelect
                              value={ticket.status}
                              onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                              options={[
                                { value: "opened", label: "Opened" },
                                { value: "in progress", label: "In Progress" },
                                { value: "closed", label: "Closed" }
                              ]}
                              className="text-xs"
                            />
                          </div>

                          {/* Priority Dropdown */}
                          <div className="w-32">
                            <ModernSelect
                              value={ticket.priority || "Medium Priority"}
                              onChange={(e) => handlePriorityChange(ticket._id, e.target.value)}
                              options={[
                                { value: "High Priority", label: "High" },
                                { value: "Medium Priority", label: "Medium" },
                                { value: "Low Priority", label: "Low" }
                              ]}
                              className="text-xs"
                            />
                          </div>

                          {/* Assign Button */}
                          <button
                            onClick={() => navigate(`/admin/assign-ticket/${ticket._id}`, { state: { ticket } })}
                            className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-medium text-main hover:bg-surface/50 transition shadow-sm hover:shadow-md"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        <p className="text-sm font-medium text-muted">No tickets found</p>
                        <p className="text-xs text-muted">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PageContainer>
      {showModal && (
        <AdminRaiseTicketModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewTicketSubmit}
        />
      )}
    </>
  );
};

export default AdminTickets;