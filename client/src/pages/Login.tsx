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
} from "@/components/ui/form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthStore } from "@/types/AuthStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore() as AuthStore;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    const { email, password } = values;
    const user = { email, password };
    login(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md mt-[-7.5rem]">
        <Card className="border-slate-800 bg-slate-900 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Login to Kano
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to sign in to your account
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
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
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-slate-950" size="lg">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-800 pt-4">
            <div className="text-sm text-slate-400 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-slate-400 underline hover:text-primary/90"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
