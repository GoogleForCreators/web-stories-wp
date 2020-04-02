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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { BUTTON_TYPES } from '../../constants';
import { Button } from '../';
import { ReactComponent as PlayArrowSvg } from '../../icons/playArrow.svg';

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
  justify-content: space-between;
  padding: 0 16px;

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
`;

const PreviewContainer = styled.div`
  display: flex;
  margin: auto auto 0;
`;

const PreviewButton = styled(Button)`
  font-size: 22px;
  align-self: center;
  line-height: 31px;
`;

const CtaContainer = styled.div`
  display: flex;
  margin: auto auto 25px;
`;

const PlayArrowIcon = styled(PlayArrowSvg).attrs({ width: 11, height: 14 })`
  margin-right: 9px;
`;

// TODO modify to handle other types of grid items, not just own stories
const CardPreviewContainer = ({
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
            <PreviewContainer>
              <PreviewButton
                type={BUTTON_TYPES.SECONDARY}
                onClick={onPreviewClick}
              >
                <PlayArrowIcon />
                {__('Preview', 'web-stories')}
              </PreviewButton>
            </PreviewContainer>
          )}
          {onOpenInEditorClick && (
            <CtaContainer>
              <Button type={BUTTON_TYPES.PRIMARY} onClick={onOpenInEditorClick}>
                {__('Open in editor', 'web-stories')}
              </Button>
            </CtaContainer>
          )}
        </EditControls>
      )}
    </>
  );
};

CardPreviewContainer.propTypes = {
  previewSource: PropTypes.string.isRequired,
  onOpenInEditorClick: PropTypes.func,
  onPreviewClick: PropTypes.func,
};

export default CardPreviewContainer;
