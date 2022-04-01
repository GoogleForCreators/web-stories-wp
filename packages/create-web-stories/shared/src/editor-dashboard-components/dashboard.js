/**
 * External dependencies.
 */
import React from 'react';
import { Dashboard, InterfaceSkeleton } from '@googleforcreators/dashboard';
import { setAppElement } from '@googleforcreators/design-system';

/**
 * Internal dependencies.
 */
import {LOCAL_STORAGE_CONTENT_KEY} from '../constants';
import { fetchStories, updateStory, trashStory } from '../api/dashboard/story';

function CustomDashboard() {
  const content = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  const newId = Object.keys(content).length ? Math.max(...Object.keys(content).map((x)=>{return parseInt(x)})) + 1 : 1;
  const appElement = document.getElementById('root');

  // see http://reactcommunity.org/react-modal/accessibility/
  setAppElement(appElement);

  const config = {
    newStoryURL: '/editor?id='+newId,
    apiCallbacks: {
      fetchStories,
      updateStory,
      trashStory
    },
  };

  return (
      <Dashboard config={config}>
        <InterfaceSkeleton/>
      </Dashboard>
  );
}
export default CustomDashboard;
