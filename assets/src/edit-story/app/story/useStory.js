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
import {
  identity,
  useContextSelector,
  convertFieldStringOrArrayToSelector,
} from '../../utils/context';
import Context from './context';

function useStory(selector) {
  return useContextSelector(Context, selector ?? identity);
}

function useStoryState(selector) {
  const newSelector = convertFieldStringOrArrayToSelector(selector ?? identity);
  return useStory((state) => newSelector(state.state));
}

function useStoryAction(selector) {
  const newSelector = convertFieldStringOrArrayToSelector(selector ?? identity);
  return useStory((state) => newSelector(state.actions));
}

export { useStory, useStoryState, useStoryAction };
