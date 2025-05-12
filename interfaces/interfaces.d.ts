export interface Song {
  id: string;
  title: string;
  album_cover: string;
  artists: Pick<Artist, "id" | "name">[];
  url: string;
  duration_ms: number;
  isLiked: boolean;
  isDownloaded: boolean;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: Image[];
  external_url: string;
  followers: number;
}

export interface Album {
  id: string;
  name: string;
  release_date: string;
  images: Image[];
  album_type: string;
  total_tracks: number;
  genres: string[];
  label: string;
  popularity: number;
  artists: Pick<Artist, "id" | "name">[];
  external_url: string;
}

export interface Playlist {
  id: string;
  name: string;
  images: Image[];
  description?: string;
  creatorName: string;
  total_tracks: number;
  external_url: string;
}

// 👇 Dòng này giúp TypeScript hiểu đây là một module
export {};
