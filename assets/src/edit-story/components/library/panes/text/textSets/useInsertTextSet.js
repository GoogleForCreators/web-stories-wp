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
import useBatchingCallback from '../../../../../utils/useBatchingCallback';
import objectWithout from '../../../../../utils/objectWithout';
import useLibrary from '../../../useLibrary';
import { useStory } from '../../../../../app/story';

function useInsertTextSet() {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const { setSelectedElementsById } = useStory(
    ({ actions: { setSelectedElementsById } }) => {
      return {
        setSelectedElementsById,
      };
    }
  );
  const insertTextSet = useBatchingCallback(
    (toAdd) => {
      const addedElements = [];
      toAdd.forEach((element) => {
        const toInsert = objectWithout(element, [
          'id',
          'previewOffsetX',
          'previewOffsetY',
          'textSetWidth',
          'textSetHeight',
        ]);
        addedElements.push(insertElement(element.type, toInsert));
      });
      // Select all added elements.
      setSelectedElementsById({
        elementIds: addedElements.map(({ id }) => id),
      });
    },
    [insertElement, setSelectedElementsById]
  );
  return insertTextSet;
}

export default useInsertTextSet;
