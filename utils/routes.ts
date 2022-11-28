export const routes = {
  setlist: {
    index({ setlistId }: { setlistId: string }) {
      return `/setlist/${setlistId}`;
    },
    artistCreate(params: { setlistId: string }) {
      return `${this.index(params)}/artist-create`;
    },
    artistSelect(params: { setlistId: string }) {
      return `${this.index(params)}/artist-select`;
    },
    songCreate(params: { setlistId: string; artistId?: string }) {
      if (params.artistId) {
        return `${this.index(params)}/song-create?artistId=${params.artistId}`;
      }
      return `${this.index(params)}/song-create`;
    },
    songSelect(params: { setlistId: string }) {
      return `${this.index(params)}/song-select`;
    },
  },
};
