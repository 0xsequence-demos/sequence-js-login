import { waasClient } from "./sequence";
import { useEffect, useState } from "react";

export function useSessionHash() {
  const [sessionHash, setSessionHash] = useState("");
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const handler = async () => {
      try {
        setSessionHash(await waasClient.getSessionHash());
      } catch (error: unknown) {
        console.error(error);
        setError(error);
      }
    };
    handler();
    return waasClient.onSessionStateChanged(handler);
  }, [setSessionHash, setError]);

  return {
    sessionHash,
    error,
    loading: !!sessionHash,
  };
}
