import NextAuth from "next-auth";
import { User as AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
        };
    }

    interface JWT {
        id?: string;
        email?: string;
        accessToken?: string;
    }
}
