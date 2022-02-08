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
 * External dependencies
 */
import { useTransform } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../components/dropTargets';
import { useHistory } from './history';
import { useAPI } from './api';
import { useConfig } from './config';
import { useFont } from './font';
import { useLocalMedia, useMedia } from './media';
import {
  useStory,
  useStoryTriggers,
  useStoryTriggerListener,
  useStoryTriggersDispatch,
  STORY_EVENTS,
  storyReducers,
} from './story';

import {
  useCanvas,
  useCanvasBoundingBox,
  useCanvasBoundingBoxRef,
  CANVAS_BOUNDING_BOX_IDS,
} from './canvas';
import { useLayout } from './layout';
import { useCurrentUser } from './currentUser';
import { useHelpCenter } from './helpCenter';
import { useUserOnboarding } from './userOnboarding';
import useRightClickMenu from './rightClickMenu/useRightClickMenu';

export {
  useHistory,
  useAPI,
  useDropTargets,
  useTransform,
  useStory,
  useStoryTriggers,
  useStoryTriggerListener,
  useStoryTriggersDispatch,
  STORY_EVENTS,
  useConfig,
  useFont,
  useLocalMedia,
  useMedia,
  useCanvas,
  useCanvasBoundingBox,
  useCanvasBoundingBoxRef,
  CANVAS_BOUNDING_BOX_IDS,
  useLayout,
  useCurrentUser,
  useHelpCenter,
  useUserOnboarding,
  useRightClickMenu,
  storyReducers,
};
