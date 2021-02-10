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
import { rgba } from 'polished';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Info } from '../../../icons';

const NoteContainer = styled.span`
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.54)};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-size: 12px;
  line-height: 16px;
  flex: 1;
  ${({ onClick }) => Boolean(onClick) && `cursor: pointer;`}
`;

const InfoIcon = styled(Info)`
  min-width: 14px;
  min-height: 14px;
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: text-top;
  margin-left: 4px;
`;

const Note = ({ onClick, children }) => {
  return (
    <NoteContainer onClick={onClick}>
      {children}
      {Boolean(onClick) && <InfoIcon />}
    </NoteContainer>
  );
};

Note.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default Note;
