import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthStore } from "@/types/AuthStore";

const loginSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = useAuthStore() as AuthStore;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    const { fullName, email, password } = values;
    const user = { fullName, email, password };
    signup(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md mt-[-7.5rem]">
        <Card className="border-slate-800 bg-slate-900 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to Kano
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to sign up for an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white" htmlFor={field.name}>
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="John Doe"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white" htmlFor={field.name}>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="name@example.com"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white" htmlFor={field.name}>
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id={field.name}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className={`bg-slate-800 text-white pr-10 ${
                              form.formState.errors.password
                                ? "border-destructive focus-visible:ring-destructive"
                                : "border-slate-700"
                            }`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-slate-950" size="lg">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-800 pt-4">
            <div className="text-sm text-slate-400 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-slate-400 underline hover:text-primary/90"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
