import { useSyncExternalStore } from "react";

import { notificationData, type UserRole } from "@/lib/demo-data";

let activeRole: UserRole = "عضو فريق";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function setDemoRole(role: UserRole) {
  activeRole = role;
  notify();
}

export function markNotificationRead(id: string) {
  const notification = notificationData.find((item) => item.id === id);
  if (notification?.unread) {
    notification.unread = false;
    notify();
  }
}

export function useDemoRole() {
  return useSyncExternalStore(subscribe, () => activeRole, () => activeRole);
}

export function useDemoDataVersion() {
  return useSyncExternalStore(subscribe, () => notificationData.map((item) => `${item.id}:${item.unread}`).join("|"), () => "server");
}
