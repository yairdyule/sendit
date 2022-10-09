import axios from "axios";
import { getCredentials } from "~/session.server";

const BASE_URL = "https://api.spotify.com/v1";

/**
 * PLAYLISTS
 **/

type CreatePlaylistParams = {
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
};

type CreatePlaylistResponse = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
};

async function createPlaylist(
  { name, description, isPublic, userId }: CreatePlaylistParams,
  access_token: string
) {
  const { data } = await axios.post<CreatePlaylistResponse>(
    `${BASE_URL}/users/${userId}/playlists`,
    {
      name,
      description,
      public: isPublic,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return data;
}

type PopulatePlaylistRequest = {
  playlistId: string;
  trackUris: string[];
};

type PopulatePlaylistResponse = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
};

async function populatePlaylist(
  { playlistId, trackUris }: PopulatePlaylistRequest,
  access_token: string
) {
  const { data } = await axios.post<PopulatePlaylistResponse>(
    `${BASE_URL}/playlists/${playlistId}/tracks`,
    {
      uris: trackUris,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

type EditPlaylistRequest = {
  playlistId: string;
  name: string;
  isPublic: boolean;
  description: string;
};

type EditPlaylistResponse = any;

async function editPlaylist({
  playlistId,
  name,
  description,
  isPublic,
}: EditPlaylistRequest) {
  const { data } = await axios.post<EditPlaylistResponse>(
    `${BASE_URL}/playlists/${playlistId}`,
    {
      name,
      description,
      public: isPublic,
    }
  );
  return data;
}

/**
 * TRACKS
 **/

export type SpotifyTrack = {
  name: string;
  uri: string;
  artists: {
    name: string;
  }[];
};

type SearchRequest = {
  query: string;
  limit?: number;
  offset?: number;
};

export type SearchResponse = {
  tracks: {
    items: SpotifyTrack[];
  };
};

async function search({ query = "", limit = 20, offset = 0 }: SearchRequest) {
  const { access_token } = await getClientCredentialsToken();
  const { data } = await axios.get<SearchResponse>(`${BASE_URL}/search`, {
    params: {
      query,
      limit,
      offset,
      type: "artist,track",
    },
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": `application/json`,
      Accept: `application/json`,
    },
  });
  // console.log(data.tracks.items);
  return data.tracks.items;
}

export type AuthorizationResponse = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

async function getClientCredentialsToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
  }).toString();
  const { basic } = getCredentials();
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: body,
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": `application/x-www-form-urlencoded`,
    },
  });

  const data = await response.json();

  return { access_token: data.access_token };
}

export type UserDataParams = {
  auth_token: string;
};
export type UserDataResponse = {
  id: string;
  uri: string;
  display_name: string;
  external_urls: { spotify: string };
  followers: {
    total: number;
  };
};

async function getUserData({ auth_token }: UserDataParams) {
  const { data } = await axios.get<UserDataResponse>(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
}

// type GetTrackRequest = {
//   trackId: string
// };
//
// type GetTrackResponse = any;
//
// async function GetTrack({
//   playlistId,
//   name,
//   description,
//   isPublic,
// }: EditPlaylistRequest) {
//   const { data } = await axios.post<EditPlaylistResponse>(
//     `${BASE_URL}/playlists/${playlistId}`,
//     {
//       name,
//       description,
//       public: isPublic,
//     }
//   );
//   return data;
// }

export const Spotify = {
  createPlaylist,
  populatePlaylist,
  editPlaylist,
  search,
  getUserData,
};
