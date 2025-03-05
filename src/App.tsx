import { Connected } from "./components/connected/Connected";
import { ErrorMessage } from "./components/error-message/ErrorMessage";
import { LoginApple } from "./components/login-apple/LoginApple";
import { LoginEmailChallenge } from "./components/login-email/LoginEmailChallenge";
import { LoginEmail } from "./components/login-email/LoginEmail";
import { LoginGoogle } from "./components/login-google/LoginGoogle";
import { LoginGuest } from "./components/login-guest/LoginGuest";

import { useUser } from "./hooks/user-provider";

import { Transition } from "@headlessui/react";
import { useState } from "react";

function useOneTimePasswordCallback() {
  const [callback, setCallback] = useState<
    ((code: string) => Promise<void>) | null
  >();
  return [callback, setCallback] as const;
}

export function App() {
  const { wallet, method, status, cancel } = useUser();

  const [emailChallengeCallback, setEmailChallengeCallback] =
    useOneTimePasswordCallback();

  return (
    <div className="grid grid-cols-1 grid-rows-1 my-auto w-full items-center justify-items-center">
      <Transition show={!!wallet}>
        <div className="transition ease-in-out data-[closed]:opacity-0 data-[closed]:translate-y-32 data-[closed]:blur-xl data-[closed]:scale-110 duration-200 col-start-1 row-start-1 flex flex-col items-center w-full gap-8 max-w-[560px] mx-auto px-6">
          <Connected />
        </div>
      </Transition>

      <Transition show={!wallet && method === "email" && status === "otp"}>
        <div className="transition ease-in-out data-[closed]:opacity-0 data-[closed]:translate-y-32 data-[closed]:blur-xl data-[closed]:scale-110 duration-200 col-start-1 row-start-1 flex flex-col items-center w-full gap-8 max-w-[512px] mx-auto">
          <LoginEmailChallenge callback={emailChallengeCallback} />
        </div>
      </Transition>

      <Transition
        show={
          !wallet &&
          (method === "google" || method === "apple") &&
          status === "pending"
        }
      >
        <div className="transition ease-in-out data-[closed]:opacity-0 data-[closed]:translate-y-32 data-[closed]:blur-xl data-[closed]:scale-110 duration-200 col-start-1 row-start-1 flex flex-col items-center w-full gap-8 max-w-[32rem]">
          <div className="grid grid-cols-1 grid-rows-1 items-center justify-items-center">
            <img
              src={"/auth/" + method + ".svg"}
              width="20"
              height="20"
              data-method={method}
              className="col-start-1 row-start-1 data-[method='apple']:invert"
            />
            <img
              src="/pending-lg.png"
              className="size-12 animate-spin col-start-1 row-start-1 opacity-25"
              alt=""
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 max-w-[256px] text-center">
            <span className="text-14 text-neutral-400">
              Finish signing in using the{" "}
              <span className="capitalize">{method}</span> authentication popup
              window
            </span>
          </div>

          <button type="button" onClick={cancel} className="underline text-14">
            Cancel
          </button>
        </div>
      </Transition>

      <Transition
        show={
          (!wallet && method === undefined) ||
          (method === "email" && status === "pending") ||
          (!wallet && method === "guest")
        }
      >
        <div className="transition ease-in-out data-[closed]:opacity-0 duration-200 data-[closed]:-translate-y-12 data-[closed]:scale-50 data-[closed]:blur-xl col-start-1 row-start-1 flex flex-col items-center justify-center w-full gap-8">
          <div
            className={`
              w-full max-w-[24rem] mx-auto rounded-[1rem] p-6 flex flex-col gap-6
              data-[status='pending']:opacity-15 data-[status='pending']:pointer-events-none
              data-[status='connected']:opacity-15 data-[status='connected']:pointer-events-none
              transition-opacity duration-300 will-change-transform
            `}
            data-status={status}
          >
            <img
              src="/acme-logo-dark.svg"
              width="96"
              className="mx-auto mb-4"
            />

            <ErrorMessage setCallback={setEmailChallengeCallback} />

            <Transition show={status !== "error"}>
              <div className="flex flex-col gap-3">
                <LoginGoogle />
                <LoginApple />
              </div>

              <hr className="opacity-10" />
              <LoginEmail setCallback={setEmailChallengeCallback} />
            </Transition>
          </div>
          {status !== "error" ? <LoginGuest /> : null}
        </div>
      </Transition>
    </div>
  );
}
