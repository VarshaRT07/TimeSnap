"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const generateTimes = () => {
  const times = [];
  for (let i = 9; i <= 18; i++) {
    const timeStr = `${i < 10 ? "0" + i : i}:00`;
    times.push(timeStr);
  }
  return times;
};
export function TimePicker({
  text,
  value,
  changeHandler
}: {
  text?: string;
  value: string | undefined;
  changeHandler: (time: string) => void;
}) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-auto justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock />
          {value ? value : <span>{text}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="grid grid-cols-2 gap-2 p-2">
          {generateTimes().map((t) => (
            <Button key={t} variant={"outline"} onClick={()=>{changeHandler(t)}}>
              {t}
            </Button>
          ))}
        </div>
        <Input
          id="time-picker"
          type="time"
          value={value || ""}
          onChange={(e) => changeHandler(e.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
