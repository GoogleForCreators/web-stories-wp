/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { useCurrentUser } from '../../../app';
import usePrepublishChecklist from './usePrepublishChecklist';
import ChecklistTab from './checklistTab';

function PrepublishInspector() {
  const { checklist, currentCheckpoint } = usePrepublishChecklist();

  const { currentUser, toggleWebStoriesMediaOptimization } = useCurrentUser(
    ({ state, actions }) => ({
      currentUser: state.currentUser,
      toggleWebStoriesMediaOptimization:
        actions.toggleWebStoriesMediaOptimization,
    })
  );

  return (
    <ChecklistTab
      areVideosAutoOptimized={currentUser?.meta?.web_stories_media_optimization}
      onAutoVideoOptimizationClick={toggleWebStoriesMediaOptimization}
      checklist={checklist}
      currentCheckpoint={currentCheckpoint}
    />
  );
}

export default PrepublishInspector;
