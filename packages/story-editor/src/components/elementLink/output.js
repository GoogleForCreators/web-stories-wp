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
import { withProtocol } from '@googleforcreators/url';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getLinkFromElement } from '.';

function WithLink({ element, children, ...rest }) {
  const link = getLinkFromElement(element) || {};
  const { url, icon, desc, rel = [] } = link;
  if (!url) {
    return children;
  }
  rel.push('noreferrer');
  const urlWithProtocol = withProtocol(url);
  return (
    // eslint-disable-next-line react/jsx-no-target-blank -- False positive
    <a
      href={urlWithProtocol}
      data-tooltip-icon={icon || undefined}
      data-tooltip-text={desc}
      target="_blank"
      rel={rel.join(' ')}
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
