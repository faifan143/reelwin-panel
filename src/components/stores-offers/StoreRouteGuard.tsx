"use client";
import { useStoreAuth } from "./StoreAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreRouteGuard({ children }: { children: React.ReactNode }) {
  const { jwt } = useStoreAuth();
  const router = useRouter();

  useEffect(() => {
    if (!jwt) {
      router.replace("/store-auth");
    }
  }, [jwt, router]);

  if (!jwt) return null;
  return <>{children}</>;
}
