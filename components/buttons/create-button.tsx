"use client";

import { PropsWithChildren, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateButtonProps extends PropsWithChildren {
  label: string;
  className?: string;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}
export const CreateButton = ({
  label,
  className,
  children,
  isOpen,
  setOpen,
}: CreateButtonProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"}>
          <Plus className="mr-2" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(className)}>{children}</DialogContent>
    </Dialog>
  );
};