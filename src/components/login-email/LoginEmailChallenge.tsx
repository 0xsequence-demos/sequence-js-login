import { Button, Field, Label } from "boilerplate-design-system";
import { InputPin } from "../input-pin/InputPin";
import { useUser } from "../../hooks/user-provider";

/** Validation schema for email form */

export function LoginEmailChallenge({
  callback,
}: {
  callback: ((code: string) => Promise<void>) | null | undefined;
}) {
  const { reset } = useUser();

  async function handleSubmitChallenge(value: string) {
    await callback?.(value);
  }

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
          <InputPin handleSubmit={handleSubmitChallenge} disabled={!callback} />
        </Field>
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
