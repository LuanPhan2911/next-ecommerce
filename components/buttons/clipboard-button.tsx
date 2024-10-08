"use client";

import { Clipboard, ClipboardCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Hint } from "../hint";
interface ClipboardButtonProps {
  value: string;
}
export const ClipboardButton = ({ value }: ClipboardButtonProps) => {
  const [active, setActive] = useState(false);
  const onClick = () => {
    navigator.clipboard.writeText(value);
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 5000);
  };
  return (
    <Hint asChild label="Copy clipboard">
      <Button size={"sm"} onClick={onClick} type="button" variant={"blue"}>
        {active ? (
          <ClipboardCheck className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>
    </Hint>
  );
};
