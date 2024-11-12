export interface TwitterAPIResponse {
  data: {
    id: string;
    text: string;
    created_at: string;
    author_id: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
    };
  }[];
  includes: {
    users: {
      id: string;
      name: string;
      username: string;
      profile_image_url: string;
    }[];
  };
}