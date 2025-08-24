import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spade } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  onLogin: (username: string) => void;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = loginSchema.extend({
  username: z.string().min(1, "Username is required"),
});

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  useEffect(() => {
    form.reset();
    setMessage("");
  }, [isLogin, form]);

  const handleSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user.email || "User");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { username: values.username },
            emailRedirectTo: `${window.location.origin}`,
          },
        });
        if (error) throw error;
        if (data.user) {
          onLogin(values.username || data.user.email || "User");
        }
      }
  } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      setMessage("Please enter your email to reset password");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset link sent to your email");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Spade className="h-8 w-8 text-blue-400 mr-2" />
            <CardTitle className="text-2xl text-white">
              Spades Scorecard
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {message && (
                <div className="text-center text-sm text-red-400">{message}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center space-y-2">
            {isLogin && (
              <button
                onClick={handleResetPassword}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </button>
            )}
            <div>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
