import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserState, UserRole } from '@/types/user';
import { Profile } from '@/types/supabase';

export const useUser = () => {
  const [userState, setUserState] = useState<UserState>({
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      console.error('Error fetching user role:', error);
      return 'member';
    }
    
    return (profile as Profile).role;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const role = await fetchUserRole(user.id);
          setUserState({
            isAdmin: role === 'admin',
            profile: { id: user.id, role }
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserState({
            isAdmin: role === 'admin',
            profile: { id: session.user.id, role }
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUserState({ isAdmin: false });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { ...userState, loading };
};
