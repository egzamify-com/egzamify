// "use client";

// import { Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "~/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "~/components/ui/card";
// import { Checkbox } from "~/components/ui/checkbox";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import { authClient } from "~/lib/auth-client";

// export default function SignIn() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   return (
//     <Card className="max-w-md rounded-none">
//       <CardHeader>
//         <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
//         <CardDescription className="text-xs md:text-sm">
//           Enter your email below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               required
//               onChange={(e) => {
//                 setEmail(e.target.value);
//               }}
//               value={email}
//             />
//           </div>

//           <div className="grid gap-2">
//             <div className="flex items-center">
//               <Label htmlFor="password">Password</Label>
//               <Link href="#" className="ml-auto inline-block text-sm underline">
//                 Forgot your password?
//               </Link>
//             </div>

//             <Input
//               id="password"
//               type="password"
//               placeholder="password"
//               autoComplete="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Checkbox
//               id="remember"
//               onClick={() => {
//                 setRememberMe(!rememberMe);
//               }}
//             />
//             <Label htmlFor="remember">Remember me</Label>
//           </div>

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={loading}
//             onClick={async () => {
//               setLoading(true);

//               await authClient.signIn.email(
//                 { email, password },
//                 {
//                   onError: (ctx) => {
//                     console.log("[AUTH] sign in error: ", ctx.error);
//                   },
//                   onSuccess: (data) => {
//                     console.log("[AUTH] succesfully signed in: ", data);
//                     toast.success("Succesfully signed in");
//                     router.push("/");
//                   },
//                 },
//               );
//             }}
//           >
//             {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth();

  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  if (isAuthenticated) {
    router.push("/");
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
        router.push("/");
      }}
    >
      <input name="email" placeholder="Email" type="text" />
      <input name="password" placeholder="Password" type="password" />
      <input name="flow" type="hidden" value={step} />
      <button type="submit">{step === "signIn" ? "Sign in" : "Sign up"}</button>
      <button
        type="button"
        onClick={() => {
          setStep(step === "signIn" ? "signUp" : "signIn");
        }}
      >
        {step === "signIn" ? "Sign up instead" : "Sign in instead"}
      </button>
      <Button onClick={() => signOut()}>log out</Button>
      <Authenticated>jestes zalogowny</Authenticated>
      <Unauthenticated>NIE jestes</Unauthenticated>
    </form>
  );
}
