import httpClient from "@/configurations/httpClient";
import type { 
  Resource, 
  CreateResourceDTO, 
  UpdateResourceDTO,
  ResourceFilters 
} from "@/types/resource.types";

const RESOURCES_ENDPOINT = "/api/resources";

export const resourceServices = {

//Get all resources with optional filters

  async getResources(filters?: ResourceFilters): Promise<Resource[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.genres && filters.genres.length > 0) {
        params.append('genres', filters.genres.join(','));
      }
      if (filters?.resourceTypes && filters.resourceTypes.length > 0) {
        params.append('types', filters.resourceTypes.join(','));
      }
      if (filters?.difficultyLevels && filters.difficultyLevels.length > 0) {
        params.append('difficulty', filters.difficultyLevels.join(','));
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.authorId) {
        params.append('authorId', filters.authorId);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const response = await httpClient.get<Resource[]>(
        `${RESOURCES_ENDPOINT}${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  /**
   * Get a single resource by ID
   */
  async getResourceById(id: string): Promise<Resource> {
    try {
      const response = await httpClient.get<Resource>(`${RESOURCES_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  /**
   * Create a new resource
   */
  async createResource(data: CreateResourceDTO): Promise<Resource> {
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('genre', JSON.stringify(data.genre));
      formData.append('resourceType', data.resourceType);
      
      if (data.tags) {
        formData.append('tags', JSON.stringify(data.tags));
      }
      if (data.difficultyLevel) {
        formData.append('difficultyLevel', data.difficultyLevel);
      }
      if (data.status) {
        formData.append('status', data.status);
      }

      // Append resource-specific data
      if (data.resourceType === 'PDF' && data.file) {
        formData.append('file', data.file);
      } else if (data.resourceType === 'Video' && data.youtubeUrl) {
        formData.append('youtubeUrl', data.youtubeUrl);
      } else if (data.resourceType === 'Exercise' && data.exercise) {
        formData.append('exercise', JSON.stringify(data.exercise));
      }

      const response = await httpClient.post<Resource>(
        RESOURCES_ENDPOINT,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  /**
   * Update an existing resource
   */
  async updateResource(data: UpdateResourceDTO): Promise<Resource> {
    try {
      const { id, ...updateData } = data;
      const response = await httpClient.put<Resource>(
        `${RESOURCES_ENDPOINT}/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  /**
   * Delete a resource
   */
  async deleteResource(id: string): Promise<void> {
    try {
      await httpClient.delete(`${RESOURCES_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  /**
   * Increment resource view count
   */
  async incrementViews(id: string): Promise<void> {
    try {
      await httpClient.post(`${RESOURCES_ENDPOINT}/${id}/view`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  /**
   * Increment resource download count
   */
  async incrementDownloads(id: string): Promise<void> {
    try {
      await httpClient.post(`${RESOURCES_ENDPOINT}/${id}/download`);
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      throw error;
    }
  },

  /**
   * Rate a resource
   */
  async rateResource(id: string, rating: number): Promise<Resource> {
    try {
      const response = await httpClient.post<Resource>(
        `${RESOURCES_ENDPOINT}/${id}/rate`,
        { rating }
      );
      return response.data;
    } catch (error) {
      console.error('Error rating resource:', error);
      throw error;
    }
  },

  /**
   * Report inappropriate content
   */
  async reportResource(id: string, reason: string): Promise<void> {
    try {
      await httpClient.post(`${RESOURCES_ENDPOINT}/${id}/report`, { reason });
    } catch (error) {
      console.error('Error reporting resource:', error);
      throw error;
    }
  },

  /**
   * Get resources by author
   */
  async getResourcesByAuthor(authorId: string): Promise<Resource[]> {
    try {
      const response = await httpClient.get<Resource[]>(
        `${RESOURCES_ENDPOINT}/author/${authorId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching author resources:', error);
      throw error;
    }
  },

  /**
   * Search resources
   */
  async searchResources(query: string): Promise<Resource[]> {
    try {
      const response = await httpClient.get<Resource[]>(
        `${RESOURCES_ENDPOINT}/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching resources:', error);
      throw error;
    }
  },
};
