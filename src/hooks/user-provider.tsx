import { createContext, useContext, useState } from "react";

export type UserContextValues = {
  wallet?: `0x${string}`;
  status: "idle" | "pending" | "connected" | "error";
  method?: "email" | "guest";
  set: {
    wallet: React.Dispatch<React.SetStateAction<`0x${string}` | undefined>>;
    status: React.Dispatch<
      React.SetStateAction<"idle" | "pending" | "error" | "connected">
    >;
    method: React.Dispatch<React.SetStateAction<"email" | "guest" | undefined>>;
  };
  reset: () => void;
};

const UserContext = createContext<null | UserContextValues>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<UserContextValues["wallet"]>();
  const [status, setStatus] = useState<UserContextValues["status"]>("idle");
  const [method, setMethod] = useState<UserContextValues["method"]>();

  function reset() {
    setWallet(undefined);
    setStatus("idle");
    setMethod(undefined);
  }

  const value = {
    wallet,
    status,
    method,
    set: {
      wallet: setWallet,
      status: setStatus,
      method: setMethod,
    },
    reset,
  } as UserContextValues;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    return {} as UserContextValues;
    // throw new Error("useField must be used within a Field");
  }
  return context;
}
