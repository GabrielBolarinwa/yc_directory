import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        const googleId = profile?.sub;
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
            id: googleId,
          });
        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id: googleId,
            name: profile?.name,
            username: profile?.email?.split("@")[0],
            email: profile?.email,
            image: profile?.picture,
            bio: "",
          });
        }
        return true;
      } catch (err) {
        console.error("Sanity user creation failed", err);
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile?.sub) {
        const author = await writeClient
          .withConfig({ useCdn: true })
          .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
            id: profile.sub,
          });
        if (author) {
          token.authorId = author?._id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.authorId) {
        session.user.id = token.authorId as string;
      }
      return session;
    },
  },
});
