import { useUser } from "../../hooks/user-provider";
import { IdentityType } from "@0xsequence/waas";
import type { EmailConflictInfo } from "@0xsequence/waas";
import { waasClient } from "../../helpers/sequence";
import { TriangleAlert } from "lucide-react";
import { LoginGoogle } from "../login-google/LoginGoogle";
import { LoginApple } from "../login-apple/LoginApple";
import { LoginEmail } from "../login-email/LoginEmail";
import { Button } from "boilerplate-design-system";

function accoutType(info: EmailConflictInfo) {
  if (info.type === IdentityType.PlayFab) {
    return { label: "PlayFab", type: "playfab" };
  }

  if (info.type === IdentityType.Email) {
    return { label: "your email address", type: "email" };
  }

  if (info.type === IdentityType.OIDC) {
    if (info.issuer.includes("cognito-idp")) {
      return { label: "OIDC", type: "oidc" };
    }

    switch (info.issuer) {
      case "https://accounts.google.com":
        return { label: "Google", type: "google" };
      case "https://appleid.apple.com":
        return { label: "Apple", type: "apple" };
      default:
        return { label: "a different method", type: "unknown" };
    }
  }

  return { label: "a different method", type: "unknown" };
}

function useEmailConflictErrorHandler() {
  const { set } = useUser();
  waasClient.onEmailConflict(async (info) => {
    set.status("error");
    set.error({ type: "email-conflict", data: info });
    set.method(undefined);
  });
}

export function ErrorMessage({
  setCallback,
}: {
  setCallback: React.Dispatch<
    React.SetStateAction<((code: string) => Promise<void>) | null | undefined>
  >;
}) {
  const { status, error, reset } = useUser();
  useEmailConflictErrorHandler();

  if (status !== "error" || error === false) {
    return null;
  }

  const { label, type } = accoutType(error.data);

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <span className="text-17 font-bold flex items-center gap-3 w-full leading-tight">
        <span className="flex items-center justify-center size-9 rounded-full bg-amber-300 text-amber-950 flex-shrink-0">
          <TriangleAlert size={24} className="mb-[3px]" />
        </span>{" "}
        A account at this address already set up with {label}
      </span>

      <p>
        It looks like you've previously signed using this email address (
        <span className="text-amber-300">{error.data.email}</span>) with another
        login method.
      </p>

      <p>
        Please sign in again using{" "}
        <span className="text-amber-300">{label}</span> to access your account.
      </p>
      <div className="w-full flex flex-col my-4 gap-4">
        {type === "google" ? <LoginGoogle /> : null}
        {type === "apple" ? <LoginApple /> : null}
        {type === "email" ? <LoginEmail setCallback={setCallback} /> : null}
      </div>
      <Button
        variant="text"
        onClick={reset}
        className="text-14 col-start-1 row-start-1 data-[status='pending']:opacity-0 data-[status='pending']:-translate-y-2 transition-all duration-300"
      >
        Try a different log in method
      </Button>
    </div>
  );
}
