/*
 * Copyright 2022 Google LLC
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
import {
  useCallback,
  useState,
  useContextSelector,
} from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import Context from './context';

/**
 * Takes a group identifier and returns a callback ref which puts the node in the specified group.
 * The returned callback ref should only be applied to one jsx element at a time.
 *
 * **Sample Usage**
 * ```js
 * function SomeComponentWithButtonInFocusGroup(){
 *   const ref = useFocusGroupRef('focus-group-1');
 *   return (
 *     <div>
 *       <p>some component</p>
 *       <button ref={ref}>Click Me!</button>
 *      </div>
 *   );
 * }
 * ```
 *
 * @param {string} groupId - identifier to indicate group by which to associate node.
 * @return {Function} callback ref that places node in specified focus group.
 */
function useFocusGroupRef(groupId) {
  const actions = useContextSelector(Context, (value) => value.actions);
  const uuid = useState(() => uuidv4())[0];
  return useCallback(
    (node) => {
      // When the component unmounts, remove it from the
      // focus group.
      if (node === null) {
        console.log('removeNodeFromGroup', [uuid, node]);
        actions.removeNodeFromGroup({
          groupId,
          nodeTuple: [uuid, node],
        });
        return;
      }
      // Add or update node in the focus group.
      actions.addNodeToGroup({
        groupId,
        nodeTuple: [uuid, node],
      });
    },
    [actions, groupId, uuid]
  );
}

export default useFocusGroupRef;
