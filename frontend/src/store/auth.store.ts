import { create } from "zustand";

interface User {
    firstName: string,
    lastName: string,
    email: string,
}
interface AuthState {
    loginUser: User | null,

    loading: boolean,

    getLoggedInUser: () => Promise<void>,
    logoutUser: () => Promise<void>,
}

export const AuthStore = create<AuthState>((set) => ({
    loginUser: null,
    loading: true,
    getLoggedInUser: async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get/user/loggedIn`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            set({
                loading: false,
                loginUser: data?.loginUser
             });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                loginUser: null
            });
        }
    },
    logoutUser: async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
            set({ loginUser: null  , loading: false });
                
            }
        } catch (err) {
            console.error(err);
        }
    },
}));