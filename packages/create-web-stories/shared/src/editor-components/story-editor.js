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
import { saveStoryById, getMedia, getFonts } from '../api';
import { LOCAL_STORAGE_CONTENT_KEY } from '../constants';
import { HeaderLayout } from './header';

function CustomEditor() {
  const content = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  const story = content ? JSON.parse(content) : {};
  const apiCallbacks = { saveStoryById, getMedia, getFonts };

  elementTypes.forEach(registerElementType);

  return (
    <div style={{ height: '100vh' }}>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
        <InterfaceSkeleton header={<HeaderLayout />} />
      </StoryEditor>
    </div>
  );
}
export default CustomEditor;
