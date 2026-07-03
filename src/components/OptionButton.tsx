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
    correct: "btn-option btn-option-correct",
    wrong: "btn-option btn-option-wrong",
    missed: "btn-option btn-option-correct opacity-60",
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
