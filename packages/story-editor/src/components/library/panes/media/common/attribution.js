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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useState } from '@googleforcreators/react';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

const StyledText = styled(Text)`
  color: ${({ theme, active }) =>
    rgba(theme.colors.standard.white, active ? 1.0 : 0.6)};
`;

const Link = styled.a`
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 8px;
  background-color: ${({ theme, active }) =>
    rgba(theme.colors.bg.primary, active ? 0.8 : 0.6)};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
`;

const Attribution = ({ author, url }) => {
  const [active, setActive] = useState(false);
  const makeActive = () => setActive(true);
  const makeInactive = () => setActive(false);

  return (
    <Link
      title={author}
      active={active}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
      href={url}
      target="_blank"
    >
      <StyledText
        forwardedAs="span"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
      >
        {author}
      </StyledText>
    </Link>
  );
};

Attribution.propTypes = {
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Attribution;
