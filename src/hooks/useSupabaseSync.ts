import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';

export const useSupabaseSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        console.log('Syncing user with Supabase:', {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress
        });

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .single();

        console.log('Check existing user result:', { existingUser, checkError });

        if (!existingUser) {
          console.log('Creating new user in Supabase');
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

          if (error) {
            console.error('Error creating user:', error);
            throw error;
          }
          console.log('Successfully created user in Supabase');
        } else {
          console.log('Updating existing user in Supabase');
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

          if (error) {
            console.error('Error updating user:', error);
            throw error;
          }
          console.log('Successfully updated user in Supabase');
        }
      } catch (error) {
        console.error('Error syncing user with Supabase:', error);
      }
    };

    syncUserWithSupabase();
  }, [user, isSignedIn, isLoaded]);
};
