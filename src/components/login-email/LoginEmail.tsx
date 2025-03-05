import { Field, Form, Input, Label, useForm } from "boilerplate-design-system";
import { useUser } from "../../hooks/user-provider";
import { useState } from "react";
import { waasClient } from "../../helpers/sequence";
import { constants } from "../../constants";
import { z } from "zod";
import { ArrowRight, TriangleAlert } from "lucide-react";

const emailLogin = z.object({
  email: z.string().email(),
});
export function LoginEmail({
  setCallback,
}: {
  setCallback: React.Dispatch<
    React.SetStateAction<((code: string) => Promise<void>) | null | undefined>
  >;
}) {
  const { set } = useUser();

  const [active, setActive] = useState(false);

  async function handleLogin(
    _: React.FormEvent<HTMLFormElement>,
    data: { email: string },
  ) {
    set.method("email");
    set.status("otp");

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

  return (
    // @ts-expect-error form onAction doesn't like the async callback
    <Form onAction={handleLogin} schema={emailLogin} className="w-full ">
      <Field
        name="email"
        className="grid grid-cols-1 grid-rows-1 focus-within:[&>label]:hidden bg-white/10 rounded-[0.5rem] relative"
      >
        <Label
          className="col-start-1 row-start-1 size-full flex items-center justify-center data-[focus='true']:opacity-0 pointer-events-none"
          data-focus={active}
          htmlFor="email"
        >
          Continue with Email
        </Label>

        <Input asChild>
          <input
            onFocus={() => setActive(true)}
            onBlur={(e) =>
              e.currentTarget.value.length < 1
                ? setActive(false)
                : setActive(true)
            }
            type="email"
            name="email"
            id="email"
            className="py-3 px-4 col-start-1 row-start-1 bg-transparent rounded-[0.5rem] border-none"
          />
        </Input>

        <button
          type="submit"
          className="size-8 rounded-full bg-white text-black data-[active='true']:opacity-100 transition-all flex items-center justify-center col-start-1 row-start-1 self-center place-self-end mr-2 opacity-0 data-[active='true']:translate-x-0 translate-x-2"
          /* @ts-expect-error inert is unknown */
          inert={!active ? "inert" : undefined}
          data-active={active}
        >
          <ArrowRight size={20} /> <span className="sr-only">Submit</span>
        </button>
      </Field>
      <ProxyFieldError name="email" />
    </Form>
  );
}

function ProxyFieldError({ name }: { name: string }) {
  const form = useForm();
  const hasError = !!form?.errors?.fieldErrors?.[name];

  return (
    <>
      <div
        className="grid grid-rows-[0fr] data-[error='true']:grid-rows-[1fr] transition-all"
        data-error={hasError}
      >
        <div
          className="rounded-md overflow-hidden min-h-0 opacity-0 data-[error='true']:opacity-100 -translate-y-2 data-[error='true']:translate-y-0 transition-all h-fit"
          data-error={hasError}
          /* @ts-expect-error inert not recognized */
          inert={hasError ? undefined : "inert"}
        >
          <div className="py-3 flex gap-2 items-center justify-center text-15">
            <TriangleAlert size={20} />
            Please enter your email address
          </div>
        </div>
      </div>
    </>
  );
}
