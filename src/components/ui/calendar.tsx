"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ru } from "date-fns/locale/ru";
import { DayPicker } from "react-day-picker";

import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-base border-2 border-border bg-background p-3 font-heading shadow-shadow",
        className,
      )}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        month_caption: "w-full text-main-foreground",
        caption_label: "text-sm font-heading",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "default" }),
          "size-9 shrink-0 p-0",
        ),
        button_next: cn(
          buttonVariants({ variant: "default" }),
          "size-9 shrink-0 p-0",
        ),
        month_grid: "w-full table-fixed border-collapse",
        weekdays: "grid grid-cols-7",
        weekday:
          "flex h-10 w-full items-center justify-center rounded-base text-[0.8rem] font-base text-main-foreground",
        week: "mt-2 grid grid-cols-7",
        day: cn(
          "relative flex h-10 w-full items-center justify-center p-0 text-center text-sm text-main-foreground focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&.day-range-end]:rounded-r-base [&.day-range-start]:rounded-l-base first:[&[aria-selected=true]]:rounded-l-base last:[&[aria-selected=true]]:rounded-r-base"
            : "[&[aria-selected=true]]:rounded-base",
        ),
        day_button: cn(
          buttonVariants({ variant: "noShadow" }),
          "size-9 shrink-0 bg-transparent p-0 font-base text-inherit aria-selected:opacity-100",
        ),
        range_start: "day-range-start rounded-l-base bg-main text-main-foreground",
        range_end: "day-range-end rounded-r-base bg-main text-main-foreground",
        selected: "rounded-base bg-main text-main-foreground",
        // Keep today's day visible without changing the activity color scale.
        today:
          "[&>button]:ring-2 [&>button]:ring-border [&>button]:ring-offset-2 [&>button]:ring-offset-background [&>button]:font-heading",
        outside: "day-outside opacity-50 aria-selected:bg-none",
        disabled: "rounded-base opacity-50",
        range_middle: "bg-main/20 text-main",
        hidden: "invisible",
        ...classNames,
      }}
      locale={ru}
      components={{
        Chevron: ({
          className,
          orientation,
          size = 16,
          disabled,
          ...props
        }) =>
          orientation === "left" ? (
            <ChevronLeft
              aria-disabled={disabled}
              className={cn("size-4", className)}
              size={size}
              {...props}
            />
          ) : (
            <ChevronRight
              aria-disabled={disabled}
              className={cn("size-4", className)}
              size={size}
              {...props}
            />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
