import { useState, useEffect, useCallback } from 'react';
import { resourceServices } from '../services/resource-services';
import type { 
  Resource, 
  CreateResourceDTO, 
  UpdateResourceDTO, 
  ResourceFilters 
} from '@/types/resource.types';

//Hook to fetch and manage resources

export const useResources = (filters?: ResourceFilters) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceServices.getResources(filters);
      setResources(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    loading,
    error,
    refetch: fetchResources,
  };
};

/**
 * Hook to fetch a single resource
 */
export const useResource = (id: string) => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await resourceServices.getResourceById(id);
        setResource(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching resource:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  return {
    resource,
    loading,
    error,
  };
};

/**
 * Hook to create a resource
 */
export const useCreateResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createResource = useCallback(async (data: CreateResourceDTO): Promise<Resource | null> => {
    try {
      setLoading(true);
      setError(null);
      const newResource = await resourceServices.createResource(data);
      return newResource;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating resource:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createResource,
    loading,
    error,
  };
};

/**
 * Hook to update a resource
 */
export const useUpdateResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateResource = useCallback(async (data: UpdateResourceDTO): Promise<Resource | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedResource = await resourceServices.updateResource(data);
      return updatedResource;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating resource:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateResource,
    loading,
    error,
  };
};

/**
 * Hook to delete a resource
 */
export const useDeleteResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteResource = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await resourceServices.deleteResource(id);
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting resource:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteResource,
    loading,
    error,
  };
};

/**
 * Hook to rate a resource
 */
export const useRateResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const rateResource = useCallback(async (id: string, rating: number): Promise<Resource | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedResource = await resourceServices.rateResource(id, rating);
      return updatedResource;
    } catch (err) {
      setError(err as Error);
      console.error('Error rating resource:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rateResource,
    loading,
    error,
  };
};

/**
 * Hook to search resources
 */
export const useSearchResources = () => {
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchResources = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await resourceServices.searchResources(query);
      setResults(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error searching resources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    searchResources,
    loading,
    error,
  };
};

/**
 * Hook to get resources by author
 */
export const useAuthorResources = (authorId: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAuthorResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await resourceServices.getResourcesByAuthor(authorId);
        setResources(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching author resources:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthorResources();
    }
  }, [authorId]);

  return {
    resources,
    loading,
    error,
  };
};
