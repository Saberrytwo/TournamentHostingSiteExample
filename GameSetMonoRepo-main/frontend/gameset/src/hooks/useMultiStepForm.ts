import { ReactElement, useState } from "react";

export function useMultiStepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function nextStep() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) {
        return i;
      } else {
        return i + 1;
      }
    });
  }

  function previousStep() {
    setCurrentStepIndex((i) => {
      if (i <= 0) {
        return i;
      } else {
        return i - 1;
      }
    });
  }

  function reset() {
    setCurrentStepIndex(0);
  }

  function goToStep(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    goToStep,
    nextStep,
    previousStep,
    reset,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
