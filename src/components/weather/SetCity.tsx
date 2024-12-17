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
import { useState } from "react";

const FormSchema = z.object({
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
});

export function SetCity() {
  const { data: session } = useSession();
  const [city, setCity] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      city: "",
    },
  });

  const handleCityUpdate = async () => {
    if (!session?.user.id) return;
    try {
      const userRef = doc(db, "users", session.user.email);
      await updateDoc(userRef, {
        city: city,
      });
      toast.success("City Updated");
    } catch (error) {
      toast.error("Error Occurred");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCityUpdate)}
        className="w-2/3 space-y-4"
      >
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. Riverside"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setCity(e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>This will be your default city.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update City</Button>
      </form>
    </Form>
  );
}
