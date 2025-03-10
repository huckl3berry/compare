
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');

  // Pre-fill admin credentials for easy signup
  const fillAdminCredentials = () => {
    setEmail('alex@endlessoutput.com');
    setPassword('Leonidas12!');
    setActiveTab('signup');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    // The auth state change will refresh the component
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signup successful! You can now sign in.');
        // After successful signup, switch to sign in tab
        setActiveTab('signin');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Portal</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <div className="flex">
                  <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="admin@example.com"
                    className="rounded-l-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <div className="flex">
                  <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password-signin"
                    type="password"
                    className="rounded-l-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  type="button"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <div className="flex">
                  <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="alex@endlessoutput.com"
                    className="rounded-l-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <div className="flex">
                  <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password-signup"
                    type="password"
                    className="rounded-l-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={fillAdminCredentials}
                  className="w-full"
                >
                  Use Admin Credentials
                </Button>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  This will fill in alex@endlessoutput.com
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
