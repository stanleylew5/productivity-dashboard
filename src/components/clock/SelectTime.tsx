"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import useTimeZones from "../../hooks/useTimeZones";
import { useState } from "react";
// Validation schema using Zod
const FormSchema = z.object({
  timeZone: z.string({
    required_error: "Please select a time zone.",
  }),
});

export function SelectTime() {
  const { data: session } = useSession();
  const { timeZones, loading, error } = useTimeZones();
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleTimeZone = async () => {
    if (!session?.user.id) return;
    try {
      const userRef = doc(db, "users", session.user.id);
      await updateDoc(userRef, {
        timezone: selectedTimeZone,
      });
      toast.success("Time Zone Updated");
    } catch (error) {
      toast.error("Error Ocurred");
    }
  };

  if (loading) return <p>Loading time zones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleTimeZone)} className="space-y-4">
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Time Zones</FormLabel>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      onClick={() => setPopoverOpen(!popoverOpen)}
                      className={cn(
                        "w-[400px] justify-between bg-dash-black-100 hover:bg-dash-black-100 hover:text-dash-orange-200",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? timeZones.find((timeZone) => timeZone === field.value)
                        : "Select time zone"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search time zone"
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No time zone found.</CommandEmpty>
                      <CommandGroup>
                        {timeZones.map((timeZone) => (
                          <CommandItem
                            value={timeZone}
                            key={timeZone}
                            onSelect={() => {
                              form.setValue("timeZone", timeZone);
                              setSelectedTimeZone(timeZone);
                              setPopoverOpen(false);
                            }}
                          >
                            {timeZone}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                timeZone === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This will be your default time zone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Time Zone</Button>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        rtl={false}
        theme="dark"
      />
    </Form>
  );
}
