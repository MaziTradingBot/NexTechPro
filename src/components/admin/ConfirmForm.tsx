"use client";

export function ConfirmForm({
  action,
  hidden,
  message,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden?: Record<string, string>;
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {Object.entries(hidden ?? {}).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {children}
    </form>
  );
}
