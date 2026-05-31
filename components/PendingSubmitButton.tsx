"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/LoadingState";

type PendingSubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  idleLabel: string;
  pendingLabel: string;
};

export function PendingSubmitButton({ idleLabel, pendingLabel, disabled, children, ...props }: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? (
        <>
          <LoadingDots />
          {pendingLabel}
        </>
      ) : children ?? idleLabel}
    </Button>
  );
}
