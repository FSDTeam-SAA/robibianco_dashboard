import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('🔐 Authorization attempt with credentials:', credentials?.email);

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
          // console.log('🌐 Calling API endpoint:', apiUrl);
          
          const requestBody = JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          });
          
          console.log('📤 Request body:', requestBody);

          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: requestBody,
          });

          // console.log('📥 Response status:', res.status);
          // console.log('📥 Response ok:', res.ok);
          
          const responseText = await res.text();
          // console.log('📥 Raw response:', responseText);
          
          let data;
          try {
            data = JSON.parse(responseText);
            // console.log('📊 Parsed response data:', data);
          } catch {
            console.error('❌ Failed to parse JSON response');
            return null;
          }

          // Check if the response indicates success
          if (!res.ok || !data.success) {
            console.error('❌ API returned error:', data?.message);
            return null;
          }

          // Your backend returns user data directly in data.data
          const userData = data.data;
          
          if (!userData) {
            console.error('❌ No user data in response');
            return null;
          }

          // console.log('✅ Login successful, user data:', userData);

          // Map your backend response to NextAuth user object
          return {
            id: userData.userId || userData.id, // Use userId from your backend
            name: userData.name || userData.email, // Add name field if available
            email: userData.email,
            role: userData.role,
            accessToken: userData.accessToken,
            image: null, // Add if your backend provides image
          };
        } catch (err) {
          console.error("❌ Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('🔑 JWT callback - user:', user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      // console.log('🔑 JWT callback - token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('💼 Session callback - token:', token);
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      console.log('💼 Session callback - session:', session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };