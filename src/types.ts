export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  author?: {
    name: string;
    username: string;
    profile_image_url: string;
  };
}