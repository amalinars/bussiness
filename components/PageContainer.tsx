import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {description ? <p className="max-w-3xl text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
