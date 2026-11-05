// A label, a control and an error message, connected for screen readers.
// `as` picks the control: "input" (default), "select" or "textarea".
function FormField({
  id,
  label,
  as: Control = "input",
  error,
  hint,
  required = false,
  className = "",
  children,
  ...controlProps
}) {
  const messageId = `${id}-message`;
  const message = error || hint;

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required && <span className="field-required"> *</span>}
      </label>

      <Control
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...controlProps}
      >
        {children}
      </Control>

      {message && (
        <p id={messageId} className={error ? "field-error" : "field-hint"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default FormField;
