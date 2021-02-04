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
import { useDropTargets } from '../components/dropTargets';
import { useTransform } from '../components/transform';
import { useHistory } from './history';
import { useAPI } from './api';
import { useConfig } from './config';
import { useFont } from './font';
import { useLocalMedia, useMedia } from './media';
import { useStory } from './story';
import { useSnackbar } from './snackbar';
import { useCanvas } from './canvas';
import { useCurrentUser } from './currentUser';

export {
  useHistory,
  useAPI,
  useDropTargets,
  useTransform,
  useStory,
  useConfig,
  useFont,
  useLocalMedia,
  useMedia,
  useSnackbar,
  useCanvas,
  useCurrentUser,
};
