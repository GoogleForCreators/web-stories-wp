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
} from '../../constants';

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
  storyId,
}) => {
  const storySaveData = {
    storyId,
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
  const storyData =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  if (storyData?.storySaveData?.storyId) {
    storyData[storySaveData?.storyId] = storySaveData;
  } else {
    storyData[storySaveData?.storyId] = storySaveData;
  }

  window.localStorage.setItem(
    LOCAL_STORAGE_CONTENT_KEY,
    JSON.stringify(storyData)
  );
  window.localStorage.setItem(LOCAL_STORAGE_PREVIEW_MARKUP_KEY, content);

  return Promise.resolve({});
};
