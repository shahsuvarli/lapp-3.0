import Login from "@/components/login/login";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex justify-center items-center flex-col h-screen bg-slate-100">
      <Login />
    </main>
  );
}
