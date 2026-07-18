"use client";

import { AuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const getLoginUser = AuthStore((state) => state.getLoggedInUser)
    useEffect(() => {
        getLoginUser();
},[])

return children
};
