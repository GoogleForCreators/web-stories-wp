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
import { useStory } from '../app/story';
import { useUnits } from '../units';
import { useCanvas } from '../components/canvas';
import { FULLBLEED_RATIO } from '../constants';

function useElementsWithLinks() {
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));
  const { pageSize } = useCanvas((state) => ({
    pageSize: state.state.pageSize,
  }));
  const { dataToEditorY } = useUnits((state) => ({
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const { elements } = currentPage;
  const elementsWithLinks = elements.filter(({ link }) => link?.url);

  const getElementsInAttachmentArea = () => {
    return elementsWithLinks.filter(({ y, height }) => {
      const bottomLimit = (pageSize.width / FULLBLEED_RATIO) * 0.8;
      const elBottom = dataToEditorY(y + height);
      return elBottom > bottomLimit;
    });
  };

  return {
    elementsWithLinks,
    getElementsInAttachmentArea,
  };
}

export default useElementsWithLinks;
