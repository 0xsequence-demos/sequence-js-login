import { Connected } from "./components/connected/Connected";
import { LoginEmail } from "./components/login-email/LoginEmail";
import { LoginSelectMethod } from "./components/login-select-method/LoginSelectMethod";

import { useUser } from "./hooks/user-provider";

import { Transition } from "@headlessui/react";

export function App() {
  const { wallet, method } = useUser();
  return (
    <div className="grid grid-cols-1 grid-rows-1 my-auto w-full items-center justify-items-center">
      <Transition show={!!wallet}>
        <div className="transition ease-in-out data-[closed]:opacity-0 data-[closed]:translate-y-32 data-[closed]:blur-xl data-[closed]:scale-110 duration-200 col-start-1 row-start-1 flex flex-col items-center w-full gap-8 max-w-[512px] mx-auto">
          <Connected />
        </div>
      </Transition>

      <Transition show={!wallet && method === "email"}>
        <div className="transition ease-in-out data-[closed]:opacity-0 data-[closed]:translate-y-32 data-[closed]:blur-xl data-[closed]:scale-110 duration-200 col-start-1 row-start-1 flex flex-col items-center w-full gap-8 max-w-[512px] mx-auto">
          <LoginEmail />
        </div>
      </Transition>

      <Transition
        show={
          (!wallet && method === undefined) || (!wallet && method === "guest")
        }
      >
        <div className="transition ease-in-out data-[closed]:opacity-0 duration-200 data-[closed]:-translate-y-12 data-[closed]:scale-50 data-[closed]:blur-xl col-start-1 row-start-1 flex flex-col items-center justify-center w-full gap-8">
          <LoginSelectMethod />
        </div>
      </Transition>
    </div>
  );
}
