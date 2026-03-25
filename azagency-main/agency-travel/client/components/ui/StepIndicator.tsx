interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-[3px] w-[140px] sm:w-[180px] rounded-full transition-colors duration-300 ${
            i < currentStep ? "bg-navy-100" : "bg-navy-100/15"
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
