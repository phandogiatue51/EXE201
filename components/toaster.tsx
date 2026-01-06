"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
      <ToastPrimitives.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-50" />
    </ToastPrimitives.Provider>
  );
}