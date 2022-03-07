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
import { MULTIPLE_VALUE } from '../../../constants';

function getPreviewOpacity(pattern) {
  if (!pattern || pattern === MULTIPLE_VALUE) {
    return null;
  }
  const isSolidPattern = pattern.type === 'solid' || !pattern.type;
  if (!isSolidPattern) {
    const { alpha = 1 } = pattern;
    return alpha * 100;
  }
  const {
    color: { a = 1 },
  } = pattern;
  return Math.round(a * 100);
}

export default getPreviewOpacity;
