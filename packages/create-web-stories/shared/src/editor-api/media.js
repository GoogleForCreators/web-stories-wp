/**
 * Internal dependencies
 */
import { getDummyMedia } from '../getDummyMedia';

export const getMedia = (params) => {
  const dummyMedia = getDummyMedia();
  const mediaResponse = {
    data: dummyMedia,
    headers: {
      totalItems: dummyMedia.length,
      totalPages: 1,
    },
  };

  if (params.searchTerm) {
    mediaResponse.data = dummyMedia.filter((media) => {
      return media.alt.toLowerCase().includes(params.searchTerm.toLowerCase());
    });
    mediaResponse.headers.totalItems = mediaResponse.data.length;
  }

  return Promise.resolve(mediaResponse);
};
