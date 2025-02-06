import { useState } from "react";

import {
  Button,
  Field,
  FieldError,
  Form,
  Input,
  Label,
} from "boilerplate-design-system";
import { waasClient } from "../../helpers/sequence";
import { z } from "zod";
import { InputPin } from "../input-pin/InputPin";
import { useUser } from "../../hooks/user-provider";
import { constants } from "../../constants";
/** Validation schema for email form */
const emailLogin = z.object({
  email: z.string().email(),
});

export function LoginEmail() {
  const { set, reset } = useUser();

  const [callback, setCallback] = useState<
    ((code: string) => Promise<void>) | null
  >();

  async function handleSubmitChallenge(value: string) {
    await callback?.(value);
  }

  async function handleLogin(
    _: React.FormEvent<HTMLFormElement>,
    data: { email: string },
  ) {
    waasClient.onEmailAuthCodeRequired(async (respondWithCode) => {
      setCallback(() => respondWithCode);
    });

    const { email } = data;
    const signInResponse = await waasClient.signIn(
      { email },
      constants.sessionName,
    );

    set.wallet(signInResponse.wallet as `0x${string}`);
  }

  // Challenge PIN for OTP
  if (callback) {
    return (
      <>
        <div className="w-full max-w-[32rem] mx-auto bg-gradient-to-b from-white/[8%] to-white/[6%] rounded-[1rem] p-6 flex flex-col gap-6 border border-white/15">
          <h2 className="text-20 tracking-[-.5%] font-medium">
            Check your email
          </h2>

          <Field name="challenge">
            <Label>PIN</Label>
            <InputPin handleSubmit={handleSubmitChallenge} />
          </Field>
        </div>
        <Button
          variant="text"
          onClick={reset}
          className="text-14 col-start-1 row-start-1 data-[status='pending']:opacity-0 data-[status='pending']:-translate-y-2 transition-all duration-300"
        >
          Try a different method
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-[32rem] mx-auto bg-gradient-to-b from-white/[8%] to-white/[6%] rounded-[1rem] p-6 flex flex-col gap-6 border border-white/15">
        <h2 className="text-20 tracking-[-.5%] font-medium">
          Sign in with your email address
        </h2>

        <Form onAction={handleLogin} schema={emailLogin}>
          <Field name="email">
            <Label>Email</Label>
            <Input type="text" className="w-full" />
            <FieldError />
          </Field>
          <Button
            type="submit"
            variant="primary"
            className="self-end"
            variant-padding="comfortable"
          >
            Continue
          </Button>
        </Form>
      </div>
      <Button
        variant="text"
        onClick={reset}
        className="text-14 col-start-1 row-start-1 data-[status='pending']:opacity-0 data-[status='pending']:-translate-y-2 transition-all duration-300"
      >
        Try a different method
      </Button>
    </>
  );
}
