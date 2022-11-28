import { EventEmitter } from "ee-ts";

type Events = {
  ArtistCreated(payload: { artistId: string }): void;
  SongCreated(payload: { songId: string }): void;
};

const eventEmitter = new EventEmitter<Events>();

export const useEventEmitter = () => {
  return eventEmitter;
};
