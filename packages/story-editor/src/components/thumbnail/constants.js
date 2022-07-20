/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';

export const THUMBNAIL_DIMENSIONS = {
  WIDTH: 54,
  HEIGHT: 96,
  NESTED_ICON: 32,
  THUMBNAIL_SHAPE: 36,
};
export const THUMBNAIL_TYPES = {
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
  TEXT: 'TEXT',
  SHAPE: 'SHAPE',
  PAGE: 'PAGE',
};

export const THUMBNAIL_SCRIM_CLASSNAME = 'thumbnail-scrim';
export const THUMBNAIL_SHOW_ON_HOVER_FOCUS = 'thumbnail-show-hover-focus';
export const DEFAULT_LOADING_MESSAGE = __('Loading', 'web-stories');
