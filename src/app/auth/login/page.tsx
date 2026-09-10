import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata = {
  title: "ورود | پارت شاپ",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
