import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={cn("space-y-1.5 p-6", className)}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return (
    <h2
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ className = "", children }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children }) {
  return (
    <div className={cn("p-3 sm:p-4", className)}>
      {children}
    </div>
  );
}

export function Button({
  variant = "default",
  size = "default",
  asChild = false,
  className = "",
  children,
  ...props
}) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "border border-border bg-background text-foreground hover:bg-muted",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-foreground hover:bg-muted",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className || ""),
      ...props,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className = "", children, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium leading-none text-foreground", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Badge({ variant = "default", className = "", children }) {
  const variants = {
    default: "border-transparent bg-slate-900 text-white",
    secondary: "border-transparent bg-slate-100 text-slate-900",
    outline: "border-border bg-background text-foreground",
    success: "border-transparent bg-emerald-100 text-emerald-700",
    destructive: "border-transparent bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function Info({ label, value, className = "" }) {
  return (
    <div className={cn("rounded-md border border-border bg-background p-3", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-foreground">
        {value || "N/A"}
      </p>
    </div>
  );
}
