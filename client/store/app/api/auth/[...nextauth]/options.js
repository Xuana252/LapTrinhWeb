import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "email...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password...",
        },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // Basic hardcoded check
        if (email === "admin@gmail.com" && password === "admin123") {
          return {
            id: "1", 
            name: "Admin User",
            email: "admin@gmail.com",
            accessToken: jwt.sign(
              {
                id: "1", 
                name: "Admin User",
                email: "admin@gmail.com",
              },
              process.env.NEXTAUTH_SECRET,
              {
                expiresIn: "30d",
              }
            ),
            expires_in: 3600 * 24 * 30,
          };
        }

        // If the credentials are invalid
        throw new Error("Invalid email or password");

        const { statusCode, data } = await login({
          email: credentials.email,
          password: credentials.password,
        });

        // Handle specific status codes for user-friendly messages
        if (statusCode) {
          if (statusCode === 401) {
            throw new Error("Invalid email or password.");
          } else if (statusCode === 403) {
            throw new Error("Your account is not authorized to log in.");
          } else if (statusCode >= 500) {
            throw new Error("Server error. Please try again later.");
          } else if (!data) {
            throw new Error("An unexpected error occurred. Please try again.");
          }
        } else {
          throw new Error(
            "Unable to connect to the server. Check your network connection."
          );
        }

        // If the login is successful
        if (data && data.access_token) {
          const decodedToken = jwt.decode(data.access_token);
          const userId = decodedToken?.id;

          if (!userId) {
            throw new Error("Invalid token.");
          }

          return {
            id: userId,
            accessToken: data.access_token,
            expiresIn: data.expires_in,
          };
        }

        // Fallback if something unexpected occurs
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/authentication/login", // Use your custom sign-in page
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;

      return session;
    },
  },
};
