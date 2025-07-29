import SignIn from "~/components/auth/SignIn";

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center justify-center md:py-10">
        <SignIn />
      </div>
    </div>
  );
}
