/**
 * External dependencies.
 */
import React from 'react';
import {
  StoryEditor,
  InterfaceSkeleton,
} from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies.
 */
import { HeaderLayout } from './header';
import { saveStoryById } from '../api/story-editor/story';
import { LOCAL_STORAGE_CONTENT_KEY } from '../constants';

function CustomEditor() {
  elementTypes.forEach(registerElementType);

  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');

  const content =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  const story = content[id] ? content[id] : {};
  const apiCallbacks = { saveStoryById };
  const config = {
    storyId: Number(id),
    apiCallbacks,
  };

  return (
    <div style={{ height: '100vh' }}>
      <StoryEditor config={config} initialEdits={{ story }}>
        <InterfaceSkeleton header={<HeaderLayout />} />
      </StoryEditor>
    </div>
  );
}

export default CustomEditor;
