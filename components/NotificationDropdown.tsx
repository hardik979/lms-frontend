import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  CheckCircle,
  Clock,
  User,
  BookOpen,
  Award,
  LucideIcon,
} from "lucide-react";

interface Notification {
  id: number;
  type: "course" | "achievement" | "reminder" | "mentor";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: LucideIcon;
  color: string;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "course",
      title: "New Course Available",
      message: "Advanced React Development course is now live",
      time: "2 hours ago",
      read: false,
      icon: BookOpen,
      color: "text-blue-400",
    },
    {
      id: 2,
      type: "achievement",
      title: "Assignment Completed",
      message: "You successfully completed JavaScript Fundamentals Quiz",
      time: "5 hours ago",
      read: false,
      icon: Award,
      color: "text-green-400",
    },
    {
      id: 3,
      type: "reminder",
      title: "Live Session Reminder",
      message: "Python Workshop starts in 30 minutes",
      time: "1 day ago",
      read: true,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      id: 4,
      type: "mentor",
      title: "Mentor Message",
      message: "Your mentor has reviewed your project submission",
      time: "2 days ago",
      read: true,
      icon: User,
      color: "text-purple-400",
    },
    {
      id: 5,
      type: "course",
      title: "Course Progress",
      message: "You are 75% complete with Data Structures course",
      time: "3 days ago",
      read: true,
      icon: BookOpen,
      color: "text-blue-400",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount: number = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: number): void => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = (): void => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: number): void => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 transition-colors cursor-pointer group ${
                      !notification.read ? "bg-slate-700/30" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full bg-slate-700 ${notification.color}`}
                      >
                        <IconComponent size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              notification.read ? "text-gray-300" : "text-white"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>

                        <p
                          className={`text-xs mt-1 ${
                            notification.read
                              ? "text-gray-400"
                              : "text-gray-300"
                          }`}
                        >
                          {notification.message}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/50">
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium w-full text-center">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Demo container to show the component in context
const NotificationModal: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      {/* Mock header bar to simulate the IT Jobs Factory interface */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-blue-400 font-bold text-lg">
              IT Jobs Factory
            </div>
            <div className="text-gray-300 text-sm">Dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-300 text-sm">Welcome back, Student!</div>
            <NotificationDropdown />
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              S
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Notification System Demo
        </h2>
        <div className="text-gray-300 space-y-2">
          <p>• Click the bell icon to open/close notifications</p>
          <p>• Red badge shows unread notification count</p>
          <p>• Click on notifications to mark them as read</p>
          <p>• Hover over notifications to see the remove (X) button</p>
          <p>• Use "Mark all read" to clear all unread notifications</p>
          <p>• Click outside the dropdown to close it</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
