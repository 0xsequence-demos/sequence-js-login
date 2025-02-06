import { Button, Form, Svg } from "boilerplate-design-system";
import { waasClient } from "../../helpers/sequence";
import { constants } from "../../constants";
import { useUser } from "../../hooks/user-provider";
import clsx from "clsx";
export function LoginGuest() {
  const { status, set } = useUser();

  async function handleGuest() {
    set.status("pending");
    set.method("guest");

    try {
      const signInResponse = await waasClient.signIn(
        { guest: true },
        constants.sessionName,
      );
      set.status("connected");
      setTimeout(() => set.wallet(signInResponse.wallet as `0x${string}`), 800);
    } catch (e) {
      console.warn(e);
      set.status("error");
    }
  }

  return (
    <Form onAction={handleGuest} className="mx-auto">
      <div className="grid grid-cols-1 grid-rows-1">
        <span
          data-status={status}
          className={clsx([
            "col-start-1 row-start-1 items-center justify-center text-14 inline-flex gap-2 relative",
            "translate-y-2 opacity-0 transition-all duration-300",
            "data-[status='idle']:invisible data-[status='idle']:z-[-1] data-[status='idle']:pointer-events-none",
            "data-[status='pending']:translate-y-0 data-[status='pending']:opacity-100",
          ])}
        >
          <img src="/pending.png" className="size-3 animate-spin" alt="" />
          Connecting
        </span>

        <span
          data-status={status}
          className={clsx([
            "col-start-1 row-start-1 items-center justify-center text-14 inline-flex gap-2 relative",
            "translate-y-2 opacity-0 transition-all duration-300",
            "data-[status='idle']:invisible data-[status='idle']:z-[-1] data-[status='idle']:pointer-events-none",
            "data-[status='connected']:translate-y-0 data-[status='connected']:opacity-100",
          ])}
        >
          {/* <span className="flex items-center justify-center size-3 bg-green-500 rounded-full">
            <Svg name="Checkmark" className="size-2.5" />
          </span>{" "} */}
          Connected
        </span>

        <Button
          type="submit"
          variant="text"
          data-status={status}
          className="text-14 col-start-1 row-start-1 data-[status='pending']:opacity-0 data-[status='pending']:-translate-y-2 data-[status='connected']:opacity-0 data-[status='connected']:-translate-y-2 transition-all duration-300"
        >
          Continue as a guest
        </Button>
      </div>
    </Form>
  );
}
