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

export * from './types';

export { default as App } from './editorApp';

export { useStory } from './app/story';
export { useCanvas } from './app/canvas';

export { default as useInsertElement } from './components/canvas/useInsertElement';
export { LayerText } from './components/panels/design/layer/layerText';
export { RichTextEditor, useRichText } from './components/richText';

/**
 * Internal dependencies
 */
import * as Icons from './icons';

export { Icons };

export { OverlayType } from './utils/backgroundOverlay';
