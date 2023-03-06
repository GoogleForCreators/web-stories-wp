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

export { default as createNewStory } from './createNewStory';
export { default as previewStory } from './previewStory';
export { default as visitDashboard } from './visitDashboard';
export { default as visitSettings } from './visitSettings';
export { default as addRequestInterception } from './addRequestInterception';
export { default as withExperimentalFeatures } from './experimentalFeatures';
export { default as withDisabledToolbarOnFrontend } from './toolbarProfileOption';
export { default as withUser } from './withUser';
export { default as withPlugin } from './withPlugin';
export { default as withRTL } from './withRTL';
export { default as deactivateRTL } from './deactivateRTL';
export { default as activateRTL } from './activateRTL';
export { default as publishPost } from './publishPost';
export { default as publishStory } from './publishStory';
export { default as addTextElement } from './addTextElement';
export { default as insertStoryTitle } from './insertStoryTitle';
export { default as setAnalyticsCode } from './setAnalyticsCode';
export { default as uploadFile } from './uploadFile';
export { default as uploadMedia } from './uploadMedia';
export { default as uploadPublisherLogo } from './uploadPublisherLogo';
export { default as toggleVideoOptimization } from './toggleVideoOptimization';
export { default as deleteMedia } from './deleteMedia';
export { default as deleteAllMedia } from './deleteAllMedia';
export { default as deleteWidgets } from './deleteWidgets';
export { default as getFileName } from './getFileName';
export { default as trashAllPosts } from './trashAllPosts';
export { default as trashAllTerms } from './trashAllTerms';
export { default as visitAdminPage } from './visitAdminPage';
export {
  addCustomFont,
  removeCustomFont,
  getFontList,
  removeAllFonts,
} from './customFonts';

export { insertProduct, setShoppingProvider } from './shopping';
export { setCurrentUser, getCurrentUser } from './user';
export { default as activatePlugin } from './activatePlugin';
export { default as deactivatePlugin } from './deactivatePlugin';
export { default as createNewPost } from './createNewPost';
export { default as createNewTerm } from './createNewTerm';
export { default as minWPVersionRequired } from './minWPVersionRequired';
export { default as visitBlockWidgetScreen } from './visitBlockWidgetScreen';
export { default as insertWidget } from './insertWidget';
export { default as triggerHighPriorityChecklistSection } from './triggerHighPriorityChecklistSection';
export { default as disableCheckbox } from './disableCheckbox';
export { default as enableCheckbox } from './enableCheckbox';
export { default as takeSnapshot } from './takeSnapshot';
export { default as loadPostEditor } from './loadPostEditor';
export { default as editStoryWithTitle } from './editStoryWithTitle';
export { default as createURL } from './createURL';

export function setPostContent(content) {
  return page.evaluate((_content) => {
    wp.data
      .dispatch('core/block-editor')
      .resetBlocks(wp.blocks.parse(_content));
  }, content);
}

export async function clearLocalStorage() {
  await page.evaluate(() => window.localStorage.clear());
}

export async function insertBlock() {
  await page.evaluate(() =>
    wp.data
      .dispatch('core/block-editor')
      .insertBlock(wp.blocks.createBlock('web-stories/embed', {}))
  );
}
