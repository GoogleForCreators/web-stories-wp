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
 * External dependencies
 */
import { identity, useContextSelector } from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import Context from './context';

function useStory(selector) {
  return useContextSelector(Context, selector ?? identity);
}

const DELIMITER = ':::';
/**
 * Returns an array of current page's story element ids. Only rerenders when there are
 * element reorders, deletions or additions
 *
 * @return {Array} array of current pages story element ids in order
 */
export function useCurrentPageElementIds() {
  // Joining and splitting with delimiter so that selector returns
  // a shallow equal result when we have a new id array instance that
  // is deeply equal. This prevents empty forced re-renders from
  // useContextSelector
  const elementIds = useStory((value) => {
    const elements = value.state.currentPage?.elements || [];
    return elements.map((element) => element.id).join(DELIMITER);
  });
  return elementIds.split(DELIMITER);
}

export default useStory;
