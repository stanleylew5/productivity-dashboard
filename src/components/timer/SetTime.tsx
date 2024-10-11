"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const FormSchema = z.object({
  timer: z
    .number()
    .lte(720, { message: "Number too large! Enter a number between 1-720!" })
    .gte(1, { message: "Number too small! Enter a number between 1-720!" }),
});

export function SetTime() {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleTimerUpdate = async (data: { timer: number }) => {
    if (!session?.user.id) return;
    try {
      const userRef = doc(db, "users", session.user.id);
      await updateDoc(userRef, {
        timer: data.timer,
      });
      toast.success("Timer Info Updated");
    } catch (error) {
      toast.error("Error Occurred");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleTimerUpdate)}
        className="w-2/3 space-y-4"
      >
        <FormField
          control={form.control}
          name="timer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timer</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="eg. 30"
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormDescription>
                This will be your default timer amount.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Timer</Button>
      </form>
    </Form>
  );
}
