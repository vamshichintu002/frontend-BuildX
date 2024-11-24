import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';

export const useSupabaseSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .single();

        if (!existingUser) {
          // Insert new user
          const { error } = await supabase.from('users').insert({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.imageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (error) throw error;
        } else {
          // Update existing user
          const { error } = await supabase
            .from('users')
            .update({
              email: user.primaryEmailAddress?.emailAddress,
              first_name: user.firstName,
              last_name: user.lastName,
              profile_image_url: user.imageUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('clerk_id', user.id);

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error syncing user with Supabase:', error);
      }
    };

    syncUserWithSupabase();
  }, [user, isSignedIn, isLoaded]);
};
