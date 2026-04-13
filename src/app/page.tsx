import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootPage() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token")?.value;

  redirect(userToken ? "/main" : "/login");
}

