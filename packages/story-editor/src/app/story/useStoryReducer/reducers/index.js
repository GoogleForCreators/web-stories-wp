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

// Manipulate pages.
export { default as addPage } from './addPage';
export { default as deletePage } from './deletePage';
export { default as updatePage } from './updatePage';
export { default as arrangePage } from './arrangePage';

// Manipulate elements on a page.
export { default as addElements } from './addElements';
export { default as deleteElements } from './deleteElements';
export { default as updateElements } from './updateElements';
export { default as updateElementsByResourceId } from './updateElementsByResourceId';
export { default as deleteElementsByResourceId } from './deleteElementsByResourceId';
export { default as setBackgroundElement } from './setBackgroundElement';
export { default as arrangeElement } from './arrangeElement';
export { default as arrangeGroup } from './arrangeGroup';
export { default as combineElements } from './combineElements';
export { default as duplicateElementsById } from './duplicateElementsById';
export { default as copySelectedElement } from './copySelectedElement';
export { default as updateElementsByFontFamily } from './updateElementsByFontFamily';

// Manipulate current page.
export { default as setCurrentPage } from './setCurrentPage';

// Manipulate list of selected elements.
export { default as setSelectedElements } from './setSelectedElements';
export { default as selectElement } from './selectElement';
export { default as unselectElement } from './unselectElement';
export { default as toggleElement } from './toggleElement';
export { default as toggleLayer } from './toggleLayer';

// Manipulate animation state
export { default as updateAnimationState } from './updateAnimationState';
export { default as addAnimations } from './addAnimations';

// Manipulate entire internal state.
export { default as restore } from './restore';

// Manipulate story-global properties.
export { default as updateStory } from './updateStory';

// Layer groups.
export { default as addGroup } from './addGroup';
export { default as updateGroup } from './updateGroup';
export { default as deleteGroup } from './deleteGroup';
export { default as duplicateGroup } from './duplicateGroup';
