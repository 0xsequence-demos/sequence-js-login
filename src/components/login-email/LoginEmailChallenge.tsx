import { Button, Field, Label } from "boilerplate-design-system";
import { InputPin } from "../input-pin/InputPin";
import { useUser } from "../../hooks/user-provider";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";

/** Validation schema for email form */
export function LoginEmailChallenge({
  callback,
}: {
  callback: ((code: string) => Promise<void>) | null | undefined;
}) {
  const { reset } = useUser();
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending">("idle");
  async function handleSubmitChallenge(value: string) {
    try {
      setStatus("pending");
      await callback?.(value);
    } catch {
      setError(true);
    } finally {
      setStatus("idle");
    }
  }

  const disabled = !callback || status === "pending" ? true : false;

  return (
    <>
      <div className="w-full max-w-[32rem] mx-auto  p-6 flex flex-col gap-6 ">
        <h2 className="text-20 tracking-[-.5%] font-medium text-center">
          Check your email for your login PIN number
        </h2>
        <Field
          name="challenge"
          className="text-center flex flex-col items-center justify-center gap-2"
        >
          <Label>PIN</Label>
          <InputPin handleSubmit={handleSubmitChallenge} disabled={disabled} />
        </Field>
        <EmailChallengePINError show={error} />
      </div>
      <Button
        variant="text"
        onClick={reset}
        className="text-14 col-start-1 row-start-1 data-[status='pending']:opacity-0 data-[status='pending']:-translate-y-2 transition-all duration-300"
      >
        Try a different log in method
      </Button>
    </>
  );
  // return (
  //   <>
  //     <div className="w-full max-w-[32rem] mx-auto  p-6 flex flex-col gap-6 ">
  //       <h2 className="text-20 tracking-[-.5%] font-medium">
  //         Sign in with your email address
  //       </h2>

  //       <Form onAction={handleLogin} schema={emailLogin}>
  //         <Field name="email">
  //           <Label>Email</Label>
  //           <Input type="text" className="w-full" />
  //           <FieldError />
  //         </Field>
  //         <Button
  //           type="submit"
  //           variant="primary"
  //           className="self-end"
  //           variant-padding="comfortable"
  //         >
  //           Continue
  //         </Button>
  //       </Form>
  //     </div>
  //     <Button
  //       variant="text"
  //       onClick={reset}
  //       className="text-14 col-start-1 row-start-1 data-[status='pending']:opacity-0 data-[status='pending']:-translate-y-2 transition-all duration-300"
  //     >
  //       Try a different method
  //     </Button>
  //   </>
  // );
}

function EmailChallengePINError({ show }: { show: boolean }) {
  return (
    <>
      <div
        className="grid grid-rows-[0fr] data-[error='true']:grid-rows-[1fr] transition-all"
        data-error={show}
      >
        <div
          className="rounded-md overflow-hidden min-h-0 opacity-0 data-[error='true']:opacity-100 -translate-y-2 data-[error='true']:translate-y-0 transition-all h-fit"
          data-error={show}
          /* @ts-expect-error inert not recognized */
          inert={show ? undefined : "inert"}
        >
          <div className="py-3 flex gap-2 items-center justify-center text-15">
            <TriangleAlert size={20} />
            Incorrect PIN, please try again
          </div>
        </div>
      </div>
    </>
  );
}
