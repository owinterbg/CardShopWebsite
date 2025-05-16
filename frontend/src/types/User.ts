export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;  // DateTime is typically serialized as ISO strings in JSON
  avatar_url: string;
  bio: string;
}
