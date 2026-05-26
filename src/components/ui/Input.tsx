import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, required, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-carbon/70">
            {label}
            {required && <span className="text-gold ml-1" aria-hidden>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={[
            "w-full px-4 py-2.5 rounded-xl border text-carbon bg-white",
            "placeholder-carbon/30 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold",
            error
              ? "border-red-400 focus:ring-red-400/50 focus:border-red-400"
              : "border-carbon/20 hover:border-carbon/40",
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helper && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-carbon/50">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
