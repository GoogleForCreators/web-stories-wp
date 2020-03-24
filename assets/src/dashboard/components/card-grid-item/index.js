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
import styled from 'styled-components';

const StyledGridItem = styled.div`
  width: ${({ theme }) => theme.grid.desktop.itemWidth};
  height: ${({ theme }) => theme.grid.desktop.itemHeight};
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    width: ${({ theme }) => theme.grid.tablet.itemWidth};
    height: ${({ theme }) => theme.grid.tablet.itemHeight};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    width: ${({ theme }) => theme.grid.mobile.itemWidth};
    height: ${({ theme }) => theme.grid.mobile.itemHeight};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    width: ${({ theme }) => theme.grid.min.itemWidth};
    height: ${({ theme }) => theme.grid.min.itemHeight};
  }
`;

const CardGridItem = ({ children, ...rest }) => (
  <StyledGridItem {...rest}>{children}</StyledGridItem>
);

CardGridItem.propTypes = {
  children: PropTypes.node,
};
export default CardGridItem;

const StyledCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 33px;
  margin-left: 3px;
  font-family: ${({ theme }) => theme.fonts.storyGridItem.family};
  font-size: ${({ theme }) => theme.fonts.storyGridItem.size};
  font-weight: ${({ theme }) => theme.fonts.storyGridItem.weight};
  letter-spacing: ${({ theme }) => theme.fonts.storyGridItem.letterSpacing};
  line-height: ${({ theme }) => theme.fonts.storyGridItem.lineHeight};
  width: 100%;
`;

const StyledTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray900};
  margin: auto 0;
`;

const StyledDate = styled.p`
  margin: auto 0;
  color: ${({ theme }) => theme.colors.gray500};
  font-family: ${({ theme }) => theme.fonts.storyGridItemSub.weight};
  font-family: ${({ theme }) => theme.fonts.storyGridItemSub.family};
`;
// TODO this needs date handling
export const CardTitle = ({ title, modifiedDate }) => {
  return (
    <StyledCardTitle>
      <StyledTitle>{title}</StyledTitle>
      <StyledDate>{`Modified ${modifiedDate} ago`}</StyledDate>
    </StyledCardTitle>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  modifiedDate: PropTypes.string.isRequired,
};

const PreviewImage = styled.img`
  object-fit: cover;
  border-radius: 8px;
  width: 100%;
  height: ${({ theme }) => theme.grid.desktop.imageHeight};

  @media ${({ theme }) => theme.breakpoint.tablet} {
    height: ${({ theme }) => theme.grid.tablet.imageHeight};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    height: ${({ theme }) => theme.grid.mobile.imageHeight};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    height: ${({ theme }) => theme.grid.min.imageHeight};
  }
`;

const EditControls = styled.div`
  width: ${({ theme }) => theme.grid.desktop.itemWidth};
  height: ${({ theme }) => theme.grid.desktop.imageHeight};
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    height: ${({ theme }) => theme.grid.tablet.imageHeight};
    width: ${({ theme }) => theme.grid.tablet.itemWidth};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    height: ${({ theme }) => theme.grid.mobile.imageHeight};
    width: ${({ theme }) => theme.grid.mobile.itemWidth};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    height: ${({ theme }) => theme.grid.min.imageHeight};
    width: ${({ theme }) => theme.grid.min.itemWidth};
  }

  & > button {
    margin: auto;
  }
`;

export const CardPreviewArea = ({
  onOpenInEditorClick,
  onPreviewClick,
  previewSource,
}) => {
  const displayEditControls = onPreviewClick || onOpenInEditorClick;

  return (
    <>
      <PreviewImage src={previewSource} alt="preview" />
      {displayEditControls && (
        <EditControls>
          {onPreviewClick && (
            <button onClick={onPreviewClick}>{'Preview'}</button>
          )}
          {onOpenInEditorClick && (
            <button onClick={onOpenInEditorClick}>{'Open in editor'}</button>
          )}
        </EditControls>
      )}
    </>
  );
};

CardPreviewArea.propTypes = {
  previewSource: PropTypes.string.isRequired,
  onOpenInEditorClick: PropTypes.func,
  onPreviewClick: PropTypes.func,
};
