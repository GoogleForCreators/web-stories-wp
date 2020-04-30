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

/**
 * Internal dependencies
 */
import { CARD_TITLE_AREA_HEIGHT } from '../../constants';
import usePagePreviewSize from '../../utils/usePagePreviewSize';
import { MoreVerticalButton } from './cardItemMenu';
import { ActionLabel } from './types';

const StyledCard = styled.div`
  margin: auto 0;
  height: ${({ cardSize, isTemplate }) =>
    cardSize.height + (isTemplate ? 0 : CARD_TITLE_AREA_HEIGHT)}px;
  width: ${({ cardSize }) => `${cardSize.width}px`};
  display: flex;
  flex-direction: column;

  &:hover ${MoreVerticalButton}, &:active ${MoreVerticalButton} {
    opacity: 1;
  }
`;

const CardGridItem = ({ children, isTemplate }) => {
  const { pageSize } = usePagePreviewSize();

  return (
    <StyledCard cardSize={pageSize} isTemplate={isTemplate}>
      {children}
    </StyledCard>
  );
};

CardGridItem.propTypes = {
  isTemplate: PropTypes.bool,
  children: PropTypes.node,
};

export default CardGridItem;
export { default as CardPreviewContainer } from './cardPreview';
export { ActionLabel };
export { default as CardTitle } from './cardTitle';
export { default as CardItemMenu, MoreVerticalButton } from './cardItemMenu';
