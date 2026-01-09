import { syncUser } from "./sync-user";

export async function getCurrentUser() {
    return await syncUser();
}
