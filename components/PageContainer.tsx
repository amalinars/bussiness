import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
};

export function PageContainer({ title, description, eyebrow, children }: PageContainerProps) {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="w-fit rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-xs font-base shadow-shadow">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-heading font-black tracking-tight md:text-3xl">{title}</h2>
        {description ? <p className="max-w-3xl font-base">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
