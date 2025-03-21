"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

interface UserProps {
  userData: {
    section?: string;
    designation?: string;
  };
}

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'REQUEST' | 'UPDATE' | 'ALERT';
  createdBy: {
    name: string;
    role: string;
  };
}

export function AppNavBar({ userData }: UserProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { 
        method: 'PUT'
      });
  
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
  
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex items-center justify-end gap-6 px-4">
        <div className="flex items-center gap-2 bg-gradient-to-r from-white/95 to-white/90 dark:from-red-950/95 dark:to-red-950/90 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-gray-200/50 dark:border-red-900/50 shadow-sm">
          <div className="text-right">
            <p className="text-base font-medium leading-none text-gray-900 dark:text-white">
              {userData.section || 'No Section'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5 font-medium">
              {userData.designation || 'No Designation'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-gray-200 dark:border-red-900 hover:bg-gray-100 dark:hover:bg-red-900/50 transition-colors relative"
              >
                <Bell className="h-[18px] w-[18px] text-gray-700 dark:text-gray-200" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <m.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center"
                    >
                      {unreadCount}
                    </m.span>
                  )}
                </AnimatePresence>
                <span className="sr-only">View notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96" align="end" sideOffset={4}>
              <DropdownMenuLabel className="font-normal p-4 pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {unreadCount} unread
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium hover:bg-gray-100 dark:hover:bg-red-900/20"
                        onClick={(e) => {
                          e.preventDefault();
                          markAllAsRead();
                        }}
                      >
                        Mark all read
                      </Button>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-[400px] overflow-auto">
                <AnimatePresence>
                  {notifications.length === 0 ? (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 text-center"
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </p>
                    </m.div>
                  ) : (
                    notifications.map((notification, index) => (
                      <m.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <DropdownMenuItem
                          className={`flex flex-col items-start gap-2 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-red-900/20 transition-all ${
                            !notification.read ? 'bg-blue-50/50 dark:bg-red-900/10' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <m.div
                              initial={{ scale: 0.5 }}
                              animate={{ scale: 1 }}
                              className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                notification.type === 'REQUEST' ? 'bg-blue-500' :
                                notification.type === 'UPDATE' ? 'bg-green-500' :
                                'bg-yellow-500'
                              }`}
                            />
                            <div className="flex-1">
                              <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {notification.createdBy?.name || 'System'}
                                </p>
                                <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(notification.createdAt).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </p>
                              </div>
                            </div>
                            <AnimatePresence>
                              {!notification.read && (
                                <m.div
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  className="h-2 w-2 rounded-full bg-blue-600 dark:bg-red-500 flex-shrink-0 mt-1"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </DropdownMenuItem>
                      </m.div>
                    ))
                  )}
                </AnimatePresence>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-full border-gray-200 dark:border-red-900 hover:bg-gray-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px] text-gray-700 dark:text-gray-200" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-gray-700 dark:text-gray-200" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                rootBox: "h-9 w-9",
                avatarBox: "h-9 w-9 rounded-full border-2 border-gray-200 dark:border-red-900",
                userButtonPopoverCard: "dark:bg-red-950 dark:border-red-900",
                userButtonTrigger: "rounded-full hover:opacity-80 transition-opacity"
              }
            }}
          />
        </div>
      </div>
    </LazyMotion>
  );
}