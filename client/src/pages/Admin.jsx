import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Admin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [resetData, setResetData] = useState({
    resetToken: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loginMutation = useMutation({
    mutationFn: () => api.login(loginData.username, loginData.password),
    onSuccess: () => {
      toast({ title: "Login Successful" });
      setLocation("/admin/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: () => api.forgotPassword(forgotUsername),
    onSuccess: (data) => {
      setShowForgotDialog(false);
      if (data.resetToken) {
        setResetData({ ...resetData, resetToken: data.resetToken });
        setShowResetDialog(true);
        toast({
          title: "Reset Token Generated",
          description: `Your reset token is: ${data.resetToken}`,
          duration: 10000,
        });
      } else {
        toast({ title: data.message });
      }
      setForgotUsername("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => api.resetPassword(resetData.resetToken, resetData.newPassword),
    onSuccess: () => {
      setShowResetDialog(false);
      setResetData({ resetToken: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const handleForgotPassword = () => {
    if (!forgotUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter your username",
        variant: "destructive"
      });
      return;
    }
    forgotPasswordMutation.mutate();
  };

  const handleResetPassword = () => {
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }
    if (resetData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    resetPasswordMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="text-5xl mx-auto mb-2">🔒</div>
          <h1 className="text-2xl font-bold" data-testid="text-title">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">
            Login to manage game results
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <Input
                id="username"
                name="username"
                required
                value={loginData.username}
                onChange={handleChange}
                placeholder="Enter username"
                data-testid="input-username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter password"
                data-testid="input-password"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="text-sm px-0"
                onClick={() => setShowForgotDialog(true)}
                data-testid="button-forgot-password"
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              <LogIn className="h-4 w-4" />
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Enter credentials For Manage
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Authorized access only.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your username to generate a reset token
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                placeholder="Enter your username"
                data-testid="input-forgot-username"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForgotDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleForgotPassword}
              disabled={forgotPasswordMutation.isPending}
              data-testid="button-submit-forgot"
            >
              {forgotPasswordMutation.isPending ? "Generating..." : "Generate Reset Token"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your reset token and new password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Reset Token</label>
              <Input
                value={resetData.resetToken}
                onChange={(e) => setResetData({ ...resetData, resetToken: e.target.value })}
                placeholder="Enter reset token"
                data-testid="input-reset-token"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <Input
                type="password"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                placeholder="Enter new password"
                data-testid="input-reset-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input
                type="password"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                data-testid="input-reset-confirm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={resetPasswordMutation.isPending}
              data-testid="button-submit-reset"
            >
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
