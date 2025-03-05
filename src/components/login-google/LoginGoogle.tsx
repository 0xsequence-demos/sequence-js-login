import { waasClient } from "../../helpers/sequence";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { env } from "../../helpers/env";
import { useUser } from "../../hooks/user-provider";
import { useSessionHash } from "../../helpers/useSessionHash";
export function LoginGoogle() {
  const { set } = useUser();

  const { sessionHash } = useSessionHash();

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    try {
      const res = await waasClient.signIn(
        {
          idToken: tokenResponse.credential!,
        },
        "Sequence JS Login Demo",
      );
      set.wallet(res.wallet as `0x${string}`);
    } catch (error) {
      console.error(error);
    }
  };

  function handleClick() {
    set.status("pending");
    set.method("google");
  }

  return (
    <>
      <GoogleOAuthProvider clientId={env.googleClientId} nonce={sessionHash}>
        <div className="bg-gradient-to-br from-white to-white/85 text-neutral-950 font-medium py-3 px-4 rounded-[0.5rem] flex gap-3 relative overflow-clip isolate justify-center items-center hover:opacity-80 transition-opacity">
          <img src="/auth/google.svg" width="20" height="20" />
          Continue with Google
          <div className="scale-[6] absolute inset-0 size-full flex items-center justify-center z-50 opacity-[0.000001]">
            <GoogleLogin
              key="google"
              ux_mode="popup"
              click_listener={handleClick}
              onSuccess={handleGoogleLogin}
              onError={() => console.warn("Error connecting with Google Login")}
            />
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
