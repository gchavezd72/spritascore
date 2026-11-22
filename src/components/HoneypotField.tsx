"use client";

/** Off-screen field. People never fill it. A filled value is rejected before any email is sent. */
export function HoneypotField({ onChange }: { onChange?: (value: string) => void }) {
  return (
    <p className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Website
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          onChange={(event) => onChange?.(event.target.value)}
        />
      </label>
    </p>
  );
}
