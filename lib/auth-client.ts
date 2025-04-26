
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
  fetchOptions: {
    credentials: "include",
  },
});