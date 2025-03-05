import { appleAuthHelpers, useScript } from "react-apple-signin-auth";
import { useSessionHash } from "../../helpers/useSessionHash";
import { waasClient } from "../../helpers/sequence";
import { useUser } from "../../hooks/user-provider";
import { Button } from "boilerplate-design-system";
import { env } from "../../helpers/env";

export function LoginApple() {
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);

  const { sessionHash } = useSessionHash();
  const { set } = useUser();
  async function handleAppleLogin(response: {
    authorization: { id_token: string };
  }) {
    const res = await waasClient.signIn(
      {
        idToken: response.authorization.id_token!,
      },
      "Sequence JS Login Demo",
    );

    set.wallet(res.wallet as `0x${string}`);
  }

  async function handleClick() {
    set.method("apple");
    set.status("pending");

    const res = await appleAuthHelpers.signIn({
      authOptions: {
        clientId: env.appleClientId,
        redirectURI: env.appleRedirectUri,
        scope: "openid email",
        usePopup: true,
        nonce: sessionHash,
      },
    });

    if (res) {
      await handleAppleLogin(res);
      console.log(res);
    } else {
      console.error("Error performing apple signin.");
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="none"
      className="bg-gradient-to-br from-white to-white/85 text-neutral-950 font-medium py-3 px-4 rounded-[0.5rem] flex gap-3 hover:opacity-80 transition-opacity"
    >
      <img src="/auth/apple.svg" width="20" height="20" />
      Continue with Apple
    </Button>
  );
}
