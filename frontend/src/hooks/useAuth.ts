import { AuthStore } from "@/store/auth.store";

export function useAuth() {
    return AuthStore();
}
