import { useEffect, useState } from "react";
import { Bell, Mail, UserPlus, AlertCircle } from "lucide-react";
import assets from "../assets/assets";
import NotificationSkeleton from "../component/NotificationSkeleton"

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
        const res = await fetch(`${import.meta.env.VITE_SERVER}api/notifications?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
            //for testing so on pro wwe would remove it 
            if(data.notifications.length === 0){
              setNotifications(assets.dummyNotifications)
            }
            else{
                 setNotifications(data.notifications);
            }
            console.log("dummyNotifications", assets.dummyNotifications)
            console.log("data.notifications", data.notifications)
         
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

   if (loading) return <NotificationSkeleton />;

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
      <div className="divide-y divide-gray-200">
        {notifications?.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition 
                ${n.isRead ? "bg-gray-50" : "bg-blue-50"} 
                hover:bg-blue-100`}
            >
              {getIcon(n.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-700">{n.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
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