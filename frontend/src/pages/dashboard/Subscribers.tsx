import React, { useEffect, useState } from "react";
import {
  Trash2,
  RefreshCw,
  AlertTriangle,
  X,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import subscriberService from "../../services/subscribeService";

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface OperationStatus {
  type: "success" | "error";
  message: string;
}

const SubscriberDashboard: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Subscriber | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await subscriberService.getAllSubscribers();
      setSubscribers(data);
    } catch (err) {
      setOperationStatus({ type: "error", message: "Failed to load subscribers" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDeleteSubscriber = async (subscriber: Subscriber) => {
    try {
      await subscriberService.deleteSubscriber(subscriber.id);
      setSubscribers((prev) => prev.filter((s) => s.id !== subscriber.id));
      setDeleteConfirm(null);
      setOperationStatus({ type: "success", message: `Deleted ${subscriber.email}` });
    } catch (err) {
      setOperationStatus({ type: "error", message: "Failed to delete subscriber" });
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // apply filters
  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter
      ? new Date(s.createdAt).toLocaleDateString("en-CA") === dateFilter
      : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-xs p-4 space-y-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded p-4 flex items-center justify-between">
        <div className="div">
        <h1 className="text-lg font-semibold text-gray-900">Subscribers Email </h1>
             <p className="text-xs text-gray-500 mt-0.5">Manage Your subscribers</p>
           
           </div>

        <button
          onClick={loadSubscribers}
          disabled={loading}
          className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-200 bg-primary-600 rounded hover:bg-gray-50 text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Counter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Subscribers</p>
            <p className="text-lg font-semibold">{subscribers.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Filtered Subscribers</p>
            <p className="text-lg font-semibold">{filteredSubscribers.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">New Today</p>
            <p className="text-lg font-semibold">
              {
                subscribers.filter(
                  (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3 text-sm"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
        {searchTerm || dateFilter ? (
          <button
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
            className="text-xs px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
          Loading subscribers...
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
          No subscribers found
        </div>
      ) : (
        <div className="bg-white rounded border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-2 px-2 text-left">#</th>
                <th className="py-2 px-2 text-left">Email</th>
                <th className="py-2 px-2 text-left">Created At</th>
                <th className="py-2 px-2 text-left">Updated At</th>
                <th className="py-2 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscribers.map((subscriber, index) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="py-2 px-2">{subscriber.email}</td>
                  <td className="py-2 px-2">{formatDate(subscriber.createdAt)}</td>
                  <td className="py-2 px-2">{formatDate(subscriber.updatedAt)}</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => setDeleteConfirm(subscriber)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-sm font-semibold">Delete Subscriber</h3>
            </div>
            <p className="text-xs text-gray-700 mb-4">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm.email}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubscriber(deleteConfirm)}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status message */}
      {operationStatus && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded shadow-lg text-xs ${
              operationStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {operationStatus.type === "success" && <CheckCircle className="w-4 h-4" />}
            {operationStatus.type === "error" && <XCircle className="w-4 h-4" />}
            <span>{operationStatus.message}</span>
            <button onClick={() => setOperationStatus(null)}>
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriberDashboard;
