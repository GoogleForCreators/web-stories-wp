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
import StoryPropTypes from '../../types';
import { getLinkFromElement } from './index';

function WithLink({ element, children, ...rest }) {
  const link = getLinkFromElement(element);
  if (!link) {
    return children;
  }
  return (
    <a
      href={link.url}
      alt={link.desc}
      data-tooltip-icon={link.icon}
      data-tooltip-text={link.desc}
      {...rest}
    >
      {children}
    </a>
  );
}

WithLink.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: StoryPropTypes.children.isRequired,
};

export default WithLink;
