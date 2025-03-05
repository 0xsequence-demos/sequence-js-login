import { Button, Form, GradientAvatar } from "boilerplate-design-system";
import { useUser } from "../../hooks/user-provider";

export function Connected() {
  const { wallet, reset } = useUser();

  function handleDisconnect() {
    reset();
  }

  if (!wallet) {
    return <>Unknown error</>;
  }

  return (
    <div className="flex flex-col gap-4 my-auto">
      <div className="w-full max-w-[32rem] mx-auto bg-gradient-to-b from-white/[8%] to-white/[6%] rounded-[1rem] p-6 flex flex-col gap-6 border border-white/[8%]">
        {" "}
        <div className="flex items-center justify-between">
          <img src="/acme-logo-dark.svg" width="64" />
          <Form onAction={handleDisconnect}>
            <Button
              type="submit"
              variant="tertiary"
              className="self-start text-14 font-medium tracking-[2%]"
            >
              Disconnect
            </Button>
          </Form>
        </div>
        <hr className="border-t border-white/5 w-full" />
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-14 text-grey-300 font-medium">Connected as</h2>
          <span className="inline-flex gap-2">
            <GradientAvatar address={wallet} className="size-6" />
            {wallet}
          </span>
        </div>
      </div>
    </div>
  );
}
