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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { withProtocol } from '../../utils/url';
import { getLinkFromElement } from './index';

function WithLink({ element, children, ...rest }) {
  const link = getLinkFromElement(element);
  if (!link?.url?.length) {
    return children;
  }
  const urlWithProtocol = withProtocol(link.url);
  return (
    <a
      href={urlWithProtocol}
      data-tooltip-icon={link.icon}
      data-tooltip-text={link.desc}
      target="_blank"
      rel="noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}

WithLink.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};

export default WithLink;
