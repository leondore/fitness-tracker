import type { User } from '@supabase/supabase-js';

export const userKey = Symbol('Key for providing user object') as InjectionKey<
  Ref<User | null>
>;
