import React from "react";
import { motion } from "framer-motion";

const NotificationCard = ({ notification }) => {
  const getNotificationStyle = (type) => {
    switch (type) {
      case "urgent":
        return {
          borderColor: "border-red-400",
          bgColor: "bg-red-50",
          iconColor: "text-red-500",
          badgeColor: "bg-red-100 text-red-800"
        };
      case "warning":
        return {
          borderColor: "border-yellow-400",
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-500",
          badgeColor: "bg-yellow-100 text-yellow-800"
        };
      default:
        return {
          borderColor: "border-blue-400",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-500",
          badgeColor: "bg-blue-100 text-blue-800"
        };
    }
  };

  const styles = getNotificationStyle(notification.type);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`flex items-start border-l-4 ${styles.borderColor} ${styles.bgColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${!notification.read ? 'ring-1 ring-emerald-300' : ''}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mr-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ${styles.iconColor}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {new Date(notification.date).toLocaleDateString()}{" "}
            {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className={`${styles.badgeColor} text-xs px-2 py-0.5 rounded-full`}>
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </span>
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="ml-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
      )}
    </motion.div>
  );
};

export default NotificationCard;