/**
 * External dependencies
 */
import { DATA_VERSION } from '@googleforcreators/migration';

/**
 * Internal dependencies
 */
import {
  LOCAL_STORAGE_CONTENT_KEY,
  LOCAL_STORAGE_PREVIEW_MARKUP_KEY,
} from '../constants';

export const saveStoryById = ({
  pages,
  globalStoryStyles,
  autoAdvance,
  defaultPageDuration,
  currentStoryStyles,
  backgroundAudio,
  content,
  title,
  excerpt,
}) => {
  const storySaveData = {
    title: {
      raw: title,
    },
    excerpt: {
      raw: excerpt,
    },
    storyData: {
      version: DATA_VERSION,
      pages,
      autoAdvance,
      defaultPageDuration,
      currentStoryStyles,
      backgroundAudio,
    },
    author: {
      id: 1,
      name: '',
    },
    stylePresets: globalStoryStyles,
    permalinkTemplate: 'https://example.org/web-stories/%pagename%/',
  };

  window.localStorage.setItem(
    LOCAL_STORAGE_CONTENT_KEY,
    JSON.stringify(storySaveData)
  );
  window.localStorage.setItem(LOCAL_STORAGE_PREVIEW_MARKUP_KEY, content);

  return Promise.resolve({});
};
