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
import { useCallback, useState } from 'react';

const Container = styled.a`
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100%);
  padding: 8px;
  color: ${({ theme, active }) => rgba(theme.colors.fg.v1, active ? 1.0 : 0.6)};
  background-color: ${({ theme, active }) =>
    rgba(theme.colors.bg.v1, active ? 0.8 : 0.6)};
  font-family: ${({ theme }) => theme.fonts.duration.family};
  font-size: ${({ theme }) => theme.fonts.duration.size};
  line-height: ${({ theme }) => theme.fonts.duration.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.duration.letterSpacing};
  text-overflow: ellipsis;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
`;

const Attribution = ({ author, url }) => {
  const [active, setActive] = useState(false);
  const makeActive = useCallback(() => setActive(true), []);
  const makeInactive = useCallback(() => setActive(false), []);

  return (
    <Container
      title={author}
      active={active}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
      href={url}
      target="_blank"
    >
      {author}
    </Container>
  );
};

Attribution.propTypes = {
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Attribution;
