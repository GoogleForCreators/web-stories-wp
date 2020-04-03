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

const PreviewPane = styled.div`
  position: relative;
  border-radius: 8px;
  height: ${({ theme }) => theme.grid.desktop.imageHeight}px;
  width: ${({ theme }) => theme.grid.desktop.itemWidth}px;
  overflow: hidden;
  z-index: -1;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    height: ${({ theme }) => theme.grid.tablet.imageHeight}px;
    width: ${({ theme }) => theme.grid.tablet.itemWidth}px;
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    height: ${({ theme }) => theme.grid.mobile.imageHeight}px;
    width: ${({ theme }) => theme.grid.mobile.itemWidth}px;
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    height: ${({ theme }) => theme.grid.min.imageHeight}px;
    width: ${({ theme }) => theme.grid.min.itemWidth}px;
  }
`;

const EditControls = styled.div`
  width: ${({ theme }) => theme.grid.desktop.itemWidth}px;
  height: ${({ theme }) => theme.grid.desktop.imageHeight}px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    height: ${({ theme }) => theme.grid.tablet.imageHeight}px;
    width: ${({ theme }) => theme.grid.tablet.itemWidth}px;
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    height: ${({ theme }) => theme.grid.mobile.imageHeight}px;
    width: ${({ theme }) => theme.grid.mobile.itemWidth}px;
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    height: ${({ theme }) => theme.grid.min.imageHeight}px;
    width: ${({ theme }) => theme.grid.min.itemWidth}px;
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

const EditButton = styled(Button).attrs({ onClick: () => {} })``;

// TODO modify to handle other types of grid items, not just own stories
const CardPreviewContainer = ({ editUrl, onPreviewClick, children }) => {
  const displayEditControls = onPreviewClick || editUrl;

  return (
    <>
      <PreviewPane>{children}</PreviewPane>
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
          {editUrl && (
            <CtaContainer>
              <EditButton forwardedAs="a" href={editUrl}>
                {__('Open in editor', 'web-stories')}
              </EditButton>
            </CtaContainer>
          )}
        </EditControls>
      )}
    </>
  );
};

CardPreviewContainer.propTypes = {
  children: PropTypes.node.isRequired,
  editUrl: PropTypes.string.isRequired,
  onPreviewClick: PropTypes.func,
};

export default CardPreviewContainer;
