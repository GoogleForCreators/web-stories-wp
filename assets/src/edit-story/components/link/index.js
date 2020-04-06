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
import { PAGE_HEIGHT, CTA_ZONE_PERCENT } from '../../constants';

export { default as LinkGuidelines } from './guidelines';

export const LinkType = {
  ONE_TAP: 1,
  TWO_TAP: 2,
};

export function getLinkFromElement(element) {
  return element.link || null;
}

export function inferLinkType(selectedElement) {
  const { y } = selectedElement;
  return y >= PAGE_HEIGHT * (1 - CTA_ZONE_PERCENT)
    ? LinkType.ONE_TAP
    : LinkType.TWO_TAP;
}

export function createLink({
  url = '',
  type = LinkType.TWO_TAP,
  ...rest
} = {}) {
  return {
    type,
    url,
    ...rest,
  };
}
