import { useEffect, useState } from "react"; 
import { Bell, Mail, UserPlus, AlertCircle } from "lucide-react";
import assets from "../assets/assets";
import NotificationSkeleton from "../component/NotificationSkeleton";

const Notification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getIcon = (type) => {
    switch (type) {
      case "connection": return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "message": return <Mail className="w-5 h-5 text-green-500" />;
      case "system": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER}api/user/notifications?userId=${userId}`
        );
        const data = await res.json();
        if (data.success) {
          //for testing so on pro wwe would remove it 
          if (data.notifications.length === 0) {
            setNotifications(assets.dummyNotifications);
          } else {
            setNotifications(data.notifications);
          }
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // 🔥 Handle marking as read
  const handleRead = async (id) => {
    try {
      // 1. Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      // 2. Update backend (optional but recommended)
      await fetch(`${import.meta.env.VITE_SERVER}api/user/notifications/read/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  if (loading) return <NotificationSkeleton />;

  return (
  <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-4 space-y-4">
  <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
  <div className="flex flex-col gap-3">
    {notifications?.length > 0 ? (
      notifications.map((n) => (
        <div
          key={n._id}
          onClick={() => handleRead(n._id)}
          className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all shadow-sm
            ${n.isRead ? "bg-gray-50" : "bg-blue-50"} 
            hover:shadow-md hover:scale-[1.01]`}
        >
          {/* Icon */}
          <div className="flex-shrink-0">{getIcon(n.type)}</div>

          {/* Text & Time */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{n.text}</p>
            <span className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Read dot */}
          {!n.isRead && (
            <span className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></span>
          )}
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No notifications</p>
    )}
  </div>
</div>
  );
};

export default Notification;