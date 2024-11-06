"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, type = "info", ...props }) => {
        let Icon;
        let typeClass = "";

        switch (type) {
          case "success":
            Icon = CheckCircle;
            typeClass = "bg-green-500 text-white";
            break;
          case "error":
            Icon = XCircle;
            typeClass = "bg-red-500 text-white";
            break;
          case "warning":
            Icon = AlertTriangle;
            typeClass = "bg-yellow-500 text-black";
            break;
          case "info":
          default:
            Icon = Info;
            typeClass = "bg-green-500 text-white";
        }

        return (
          <Toast key={id} {...props} className={`transition-transform duration-200 ${typeClass}`}>
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6" />
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
