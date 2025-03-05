import { useField } from "boilerplate-design-system";
import { useRef, useState } from "react";

export function InputPin(props: {
  id?: string;
  handleSubmit: (value: string) => void;
  digits?: number;
}) {
  const { id, handleSubmit, digits = 6 } = props;

  const { name } = useField();

  const [pin, setPin] = useState<string>("");
  const [caret, setCaret] = useState<number | null>(null);
  const [, setStatus] = useState<"idle" | "pending" | "complete">("idle");
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPin(e.target.value);

    const input = e.currentTarget;
    if (input) {
      const position = input.selectionStart;

      if (position || position === 0) {
        input.setSelectionRange(position, position + 1);
        setCaret(position);
      }
      if (input.value.length >= digits) {
        setStatus("pending");
        // handleSubmit?.(input.value);
      }
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    if (input.value.length >= digits) {
      input.setSelectionRange(input.value.length - 1, input.value.length);
      setCaret(input.value.length - 1);
    } else {
      input.setSelectionRange(input.value.length, input.value.length);
      setCaret(input.value.length);
    }
  }

  function handleBlur() {
    setCaret(null);
  }

  function handleKeyup(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    if (!input) return;

    const position = input.selectionStart;
    if (
      position === undefined ||
      position === null ||
      typeof caret !== "number"
    )
      return;

    switch (e.key) {
      case "Enter":
      case "Return":
        handleSubmit?.(input.value);
        break;
      case "Escape":
        input.blur();
        setCaret(null);
        break;
      case "ArrowLeft":
        if (position < 1) {
          input.setSelectionRange(0, 1);
          setCaret(position);
        } else {
          input.setSelectionRange(caret - 1, caret);
          setCaret(caret - 1);
        }

        break;
      case "ArrowRight":
        if (position >= digits) {
          input.setSelectionRange(digits - 1, digits);
          setCaret(digits - 1);
        } else {
          input.setSelectionRange(position, position + 1);
          setCaret(position);
        }

        break;
      case "ArrowUp":
        setCaret(0);
        input.setSelectionRange(0, 1);

        break;

      case "ArrowDown":
        input.setSelectionRange(digits - 1, digits);
        setCaret(digits - 1);
        break;
    }
  }

  function selectCharacter(e: React.MouseEvent<HTMLButtonElement>) {
    const input = ref.current;

    const index = e.currentTarget.dataset?.index
      ? parseInt(e.currentTarget.dataset.index)
      : 0;
    if (input) {
      input.focus();
      input.setSelectionRange(index, index + 1);

      if (index > input.value.length) {
        setCaret(input.value.length);
      } else {
        setCaret(index);
      }
    }
  }

  return (
    <div
      className="grid grid-cols-6 gap-2 relative w-full max-w-[20rem]"
      aria-hidden
    >
      {Array.from({ length: digits }).map((_, index) => (
        <button
          key={`digit-${index}`}
          type="button"
          data-index={index}
          className={`flex-1 aspect-[1/1.2] border rounded-[0.5rem] bg-white/10 text-20 md:text-24 font-bold ${
            caret === index ? "border-white bg-white/25" : "border-white/0"
          }`}
          onClick={selectCharacter}
          tabIndex={-1}
        >
          {pin[index]}
        </button>
      ))}
      <input
        ref={ref}
        name={name}
        id={id || name}
        type="text"
        value={pin}
        autoCapitalize="off"
        autoComplete="one-time-code"
        data-1p-ignore
        data-lpignore
        data-input-otp
        inputMode="numeric"
        pattern="^\d+$"
        maxLength={6}
        onKeyUp={handleKeyup}
        onInput={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="opacity-0 absolute w-full h-full inset-0 pointer-events-none"
      />
    </div>
  );
}
