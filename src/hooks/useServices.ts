import { useEffect, useState } from 'react';
import { Service } from '../types';
import { supabase } from '../lib/supabase';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error: err } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true });

        if (err) throw err;

        setServices((data || []) as Service[]);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { services, loading, error };
}
