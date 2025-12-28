import { type AxiosInstance, type AxiosResponse } from 'axios'; // Type-only imports
import api from '../api/api'; // adjust the import path as needed

// BlogReply interface
export interface BlogReply {
  id: string;
  blogId: string;
  fullName: string;
  email: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Blog interface
export interface Blog {
  excerpt: string;
  author: string;
  date: any;
  id: string;
  title: string;
  description: string;
  quote?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  replies?: BlogReply[];
}

// Input types
export type CreateBlogInput = Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'replies'>;
export type UpdateBlogInput = Partial<CreateBlogInput>;

// Delete response
interface DeleteResponse {
  message: string;
}

/**
 * Blog Service
 * Handles all blog-related API calls
 */
class BlogService {
  private api: AxiosInstance = api;

  
  constructor() {
    this.getAllBlogs = this.getAllBlogs.bind(this);
    this.createBlog = this.createBlog.bind(this);
    this.getBlogById = this.getBlogById.bind(this);
    this.updateBlog = this.updateBlog.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
    this.addReply = this.addReply.bind(this);
    this.getReplies = this.getReplies.bind(this);
  }

  /**
   * Create a new blog
   * @param blogData - Blog data
   * @returns Created blog
   */
  async createBlog(blogData: FormData | CreateBlogInput): Promise<Blog> {
    try {
      const response: AxiosResponse<Blog> = await this.api.post('/blogs', blogData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create blog';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all blogs
   * @returns Array of blogs
   */
  async getAllBlogs(): Promise<Blog[]> {
    try {
      const response: AxiosResponse<Blog[]> = await this.api.get('/blogs');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch blogs';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get blog by ID
   * @param id - Blog ID
   * @returns Blog or null if not found
   */
  async getBlogById(id: string): Promise<Blog | null> {
    try {
      const response: AxiosResponse<Blog> = await this.api.get(`/blogs/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching blog by ID:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch blog';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a blog
   * @param id - Blog ID
   * @param updateData - Data to update
   * @returns Updated blog
   */
  async updateBlog(id: string, updateData: FormData | UpdateBlogInput): Promise<Blog> {
    try {
      const response: AxiosResponse<Blog> = await this.api.patch(`/blogs/${id}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update blog';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a blog
   * @param id - Blog ID
   * @returns Response with success message
   */
  async deleteBlog(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete blog';
      throw new Error(errorMessage);
    }
  }

  /**
   * Add reply to a blog
   * @param blogId - Blog ID
   * @param replyData - Reply data
   * @returns Created reply
   */
  async addReply(blogId: string, replyData: Omit<BlogReply, 'id' | 'blogId' | 'createdAt' | 'updatedAt'>): Promise<BlogReply> {
    try {
      const response: AxiosResponse<BlogReply> = await this.api.post(`/blogs/${blogId}/replies`, replyData);
      return response.data;
    } catch (error: any) {
      console.error('Error adding reply:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add reply';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all replies for a blog
   * @param blogId - Blog ID
   * @returns Array of replies
   */
  async getReplies(blogId: string): Promise<BlogReply[]> {
    try {
      const response: AxiosResponse<BlogReply[]> = await this.api.get(`/blogs/${blogId}/replies`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching replies:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch replies';
      throw new Error(errorMessage);
    }
  }
}

// Singleton instance
const blogService = new BlogService();
export default blogService;

// Named exports
export const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  addReply,
  getReplies,
} = blogService;
