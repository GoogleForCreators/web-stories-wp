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
import DisplayElement from '../../edit-story/components/canvas/displayElement';
import StoryPropTypes from '../../edit-story/types';

function PreviewPage({ page }) {
  return page.elements.map(({ id, ...rest }) => (
    <DisplayElement key={id} page={page} element={{ id, ...rest }} />
  ));
}

PreviewPage.propTypes = {
  page: StoryPropTypes.page.isRequired,
};

export default PreviewPage;
