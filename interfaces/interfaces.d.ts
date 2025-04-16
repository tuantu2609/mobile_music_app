interface Song {
  id: string;
  title: string;
  explicit: boolean;
  album_cover: string;
  artists: Pick<Artist, "id" | "name">[];
  popularity: number;
  preview_url?: string;
  release_date: string;
  is_playable: boolean;
  duration_ms: number;
  image?: ImageSourcePropType;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: Image[];
  external_url: string;
  followers: number;
}

interface Album {
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

interface Playlist {
  id: string;
  name: string;
  images: Image[];
  description?: string;
  creatorName: string;
  total_tracks: number;
  external_url: string;
}
