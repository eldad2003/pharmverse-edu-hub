
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  password: string;
  yearGroup: string;
  role: 'admin' | 'student';
}

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '', yearGroup: '', role: 'student' as const });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirmPassword: '', yearGroup: '' });
  const { toast } = useToast();

  const yearGroups = ['Pharm D1', 'Pharm D2', 'Pharm D3', 'Pharm D4', 'Pharm D5', 'Pharm D6'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.role === 'admin' && loginForm.password === 'admin123') {
      if (!loginForm.yearGroup) {
        toast({
          title: "Error",
          description: "Please select a year group for admin access",
          variant: "destructive"
        });
        return;
      }
      onLogin({
        username: 'Admin',
        password: loginForm.password,
        yearGroup: loginForm.yearGroup,
        role: 'admin'
      });
      toast({
        title: "Welcome Admin!",
        description: `Logged in as admin for ${loginForm.yearGroup}`,
      });
    } else if (loginForm.role === 'student') {
      // Simple student login (in real app, would validate against database)
      const storedUsers = JSON.parse(localStorage.getItem('pharmapp_users') || '[]');
      const user = storedUsers.find((u: User) => u.username === loginForm.username && u.password === loginForm.password);
      
      if (user) {
        onLogin(user);
        toast({
          title: "Welcome back!",
          description: `Logged in successfully`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!registerForm.yearGroup) {
      toast({
        title: "Error", 
        description: "Please select a year group",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      username: registerForm.username,
      password: registerForm.password,
      yearGroup: registerForm.yearGroup,
      role: 'student'
    };

    const storedUsers = JSON.parse(localStorage.getItem('pharmapp_users') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('pharmapp_users', JSON.stringify(storedUsers));

    toast({
      title: "Registration Successful!",
      description: "You can now login with your credentials",
    });

    setRegisterForm({ username: '', password: '', confirmPassword: '', yearGroup: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full pharm-gradient mb-4 animate-glow">
            <span className="text-2xl font-bold text-white">Rx</span>
          </div>
          <h1 className="text-4xl font-bold text-pharm-blue-800 mb-2">PharmApp</h1>
          <p className="text-pharm-blue-600">Your Pharmacy Education Platform</p>
        </div>

        <Card className="glass-card neomorphic">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-pharm-blue-800">Welcome</CardTitle>
            <CardDescription>Access your pharmacy education portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 neomorphic">
                <TabsTrigger value="login" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={loginForm.role} onValueChange={(value: 'admin' | 'student') => setLoginForm({...loginForm, role: value})}>
                      <SelectTrigger className="neomorphic-inset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {loginForm.role === 'student' && (
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                        className="neomorphic-inset"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="neomorphic-inset"
                      required
                    />
                  </div>

                  {loginForm.role === 'admin' && (
                    <div className="space-y-2">
                      <Label>Year Group</Label>
                      <Select value={loginForm.yearGroup} onValueChange={(value) => setLoginForm({...loginForm, yearGroup: value})}>
                        <SelectTrigger className="neomorphic-inset">
                          <SelectValue placeholder="Select year group" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          {yearGroups.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button type="submit" className="w-full pharm-gradient pharm-gradient-hover text-white neomorphic">
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input
                      id="reg-username"
                      type="text"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                      className="neomorphic-inset"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      className="neomorphic-inset"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      className="neomorphic-inset"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Year Group</Label>
                    <Select value={registerForm.yearGroup} onValueChange={(value) => setRegisterForm({...registerForm, yearGroup: value})}>
                      <SelectTrigger className="neomorphic-inset">
                        <SelectValue placeholder="Select your year group" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {yearGroups.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full pharm-gradient pharm-gradient-hover text-white neomorphic">
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
