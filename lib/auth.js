import users from "../constants/users.json";
import CredentialsProvider from "next-auth/providers/credentials";
import { connection } from "@/utils/db";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        // const passwordCorrect = await compare(
        //   credentials?.password,
        //   user.password
        // );
        const isThereAccount = users.find(
          (user) => user.email === credentials?.email
        );

        if (isThereAccount) {
          const passwordCorrect =
            credentials?.password === isThereAccount.password &&
            credentials?.email === isThereAccount.email;

          if (passwordCorrect) {
            const userData = {
              id: isThereAccount.id,
              email: isThereAccount.email,
            };

            return userData;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // if (trigger === "update") {
      //   return { ...token, ...session.user };
      // }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      const { recordset } = await connection
        .request()
        .query(
          `select top 1 * from employees where email='${session.user.email}' and is_active=1`
        );
      const userData = recordset[0];
      const image = users.find((user) => user.email === userData.email).image;
      return {
        user: {
          id: userData.employee_id,
          name: userData.name + " " + userData.surname,
          image,
          position: userData.position,
        },
      };
    },
  },
};
