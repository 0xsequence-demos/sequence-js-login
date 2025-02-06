import clsx from "clsx";
import { useUser } from "../../hooks/user-provider";
import { LoginGuest } from "../login-guest/LoginGuest";
import { Button } from "boilerplate-design-system";

export function LoginSelectMethod() {
  const { status, set } = useUser();

  return (
    <>
      <div
        className={clsx([
          "w-full max-w-[24rem] mx-auto rounded-[1rem] p-6 flex flex-col gap-6 ",
          // "bg-gradient-to-b from-white/[8%] to-white/[6%] border border-white/15",
          "data-[status='pending']:opacity-15 data-[status='pending']:pointer-events-none",
          "data-[status='connected']:opacity-15 data-[status='connected']:pointer-events-none",
          "transition-opacity duration-300 will-change-transform",
        ])}
        data-status={status}
      >
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {}}
            variant="none"
            className="bg-gradient-to-br from-white to-white/85 text-neutral-950 font-medium py-3 px-4 rounded-[0.5rem] flex gap-3"
          >
            <img src="/auth/apple.svg" width="20" height="20" />
            Continue with Apple
          </Button>
          <Button
            onClick={() => {}}
            variant="none"
            className="bg-gradient-to-br from-white to-white/85 text-neutral-950 font-medium py-3 px-4 rounded-[0.5rem] flex gap-3"
          >
            <img src="/auth/google.svg" width="20" height="20" />
            Continue with Google
          </Button>
        </div>

        <hr className="opacity-10" />
        <Button
          onClick={() => set.method("email")}
          variant="none"
          className="bg-white/10 py-3 px-4 rounded-[0.5rem]"
        >
          Continue with Email
        </Button>
      </div>
      <LoginGuest />
    </>
  );
}
