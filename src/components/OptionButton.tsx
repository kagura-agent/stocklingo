"use client";

type OptionState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function OptionButton({
  label,
  state,
  onClick,
  disabled,
}: {
  label: string;
  state: OptionState;
  onClick: () => void;
  disabled: boolean;
}) {
  const stateClass: Record<OptionState, string> = {
    default: "btn-option",
    selected: "btn-option btn-option-selected",
    correct: "btn-option btn-option-correct animate-pulse-correct shadow-[0_0_12px_rgba(88,204,2,0.4)]",
    wrong: "btn-option btn-option-wrong animate-shake",
    missed: "btn-option btn-option-correct animate-pulse-correct opacity-60",
  };

  return (
    <button
      className={stateClass[state]}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
