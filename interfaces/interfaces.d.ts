interface Song {
  id: string;
  title: string;
  explicit: boolean;
  album_cover: string;
  genre_ids?: string[]; // Spotify không gán genre trực tiếp cho track, thường lấy từ artist
  language?: string;
  artists: Pick<Artist, "id" | "name">[];
  description?: string;
  popularity: number; // 0 - 100
  preview_url?: string; // link nhạc mẫu 30s
  release_date: string;
  is_playable: boolean;
  duration_ms: number;
  image: ImageSourcePropType;
}

interface TrendingSong {
  song: Song;
  searchTerm: string;
  count: number;
}

interface SongDetails {
  id: string;
  title: string;
  explicit: boolean;
  album: Album;
  artists: Artist[];
  available_markets: string[];
  popularity: number;
  preview_url?: string;
  duration_ms: number;
  is_playable: boolean;
  external_urls: {
    spotify: string;
  };
}

interface TrendingCardProps {
  song: TrendingSong;
  index: number;
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
  images?: Image[];
}

interface Album {
  id: string;
  name: string;
  release_date: string;
  images: Image[];
}

interface Playlist {
  name: string;
  images: Image[];
  description?: string;
  creatorName: string;
}
