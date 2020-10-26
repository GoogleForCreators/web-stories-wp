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

export { default as clamp } from './clamp';
export { default as getCurrentYAxis } from './getCurrentYAxis';
export { default as groupBy } from './groupBy';
export { default as keyboardOnlyOutline } from './keyboardOnlyOutline';
export { default as memoize } from './memoize';
export { default as throttleToAnimationFrame } from './throttleToAnimationFrame';
export { default as useDashboardResultsLabel } from './useDashboardResultsLabel';
export { default as useFocusOut } from './useFocusOut';
export { default as useGridViewKeys } from './useGridViewKeys';
export {
  default as usePagePreviewSize,
  getPagePreviewHeights,
} from './usePagePreviewSize';
export { default as useStoryView } from './useStoryView';
export { default as useTemplateView } from './useTemplateView';
export { default as validateGoogleAnalyticsIdFormat } from './validateGoogleAnalyticsIdFormat';

export { default as addQueryArgs } from '../../edit-story/utils/addQueryArgs';
export { default as getStoryPropsToSave } from '../../edit-story/app/story/utils/getStoryPropsToSave';
export { useKeyDownEffect } from '../../edit-story/components/keyboard';
export {
  focusOnPage,
  getArrowDir,
  getGridColumnAndRowCount,
  getRow,
  getColumn,
  getIndex,
} from '../../edit-story/components/canvas/gridview/useGridViewKeys';
export { default as useResizeEffect } from '../../edit-story/utils/useResizeEffect';
// TODO use these shared utils to structure image resources mirroring editor
export { default as getTypeFromMime } from '../../edit-story/app/media/utils/getTypeFromMime';
export { default as getResourceFromLocalFile } from '../../edit-story/app/media/utils/getResourceFromLocalFile';
export {
  createContext,
  identity,
  useContextSelector,
} from '../../edit-story/utils/context';
