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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useCanvas from '../useCanvas';
import { FULLBLEED_RATIO } from '../../../constants';
import Popup from '../../popup';
import { useTransform } from '../../transform';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  bottom: ${({ fullbleedBottom }) => -fullbleedBottom}px;
  ${({ displayMarker, theme }) =>
    displayMarker &&
    `
  background-image: linear-gradient(to right, ${theme.colors.fg.v0} 50%, transparent 0%);
  background-position: top;
  background-size: 16px 0.5px;
  background-repeat: repeat-x;`}
  height: 20%;
  width: 100%;
  color: ${({ theme }) => theme.colors.fg.v1};
  z-index: 3;
`;

// The CSS here is based on how it's displayed in the front-end, including static
// font-size, line-height, etc. independent of the viewport size -- it's not responsive.
const Icon = styled.div`
  position: relative;
  display: block;
  height: 28px;
  width: 32px;
`;

const arrowBarCss = css`
  position: absolute;
  display: block;
  height: 3px;
  width: 12px;
  border-radius: 3px;
  top: 14px;
  background: ${({ theme }) => theme.colors.fg.v1};
`;

const LeftBar = styled.div`
  ${arrowBarCss}
  left: 6px;
  transform: rotate(-30deg);
`;

const RightBar = styled.div`
  ${arrowBarCss}
  right: 6px;
  transform: rotate(30deg);
`;

const TextWrapper = styled.span`
  font-family: Roboto;
  font-size: 16px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.36);
  white-space: nowrap;
  max-width: 90%;
  position: relative;
  padding: 0 32px;
  margin: 0 0 20px;
  height: 16px;
  letter-spacing: 0.3px;
`;

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v0};
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 200px;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
`;

const spacing = { x: 8 };

function PageAttachment({ pageAttachment = {} }) {
  const {
    pageSize,
    hasLinkInAttachmentArea,
    pageAttachmentContainer,
    setPageAttachmentContainer,
  } = useCanvas((state) => ({
    hasLinkInAttachmentArea: state.state.hasLinkInAttachmentArea,
    pageSize: state.state.pageSize,
    pageAttachmentContainer: state.state.pageAttachmentContainer,
    setPageAttachmentContainer: state.actions.setPageAttachmentContainer,
  }));
  const {
    state: { isAnythingTransforming },
  } = useTransform();
  const fullbleedHeight = pageSize.width / FULLBLEED_RATIO;
  const fullbleedBottom = (fullbleedHeight - pageSize.height) / 2;
  const { ctaText = __('Learn more', 'web-stories'), url } = pageAttachment;
  return (
    <Wrapper
      role="presentation"
      fullbleedBottom={fullbleedBottom}
      displayMarker={hasLinkInAttachmentArea}
      ref={setPageAttachmentContainer}
    >
      {url?.length > 0 && (
        <>
          <Icon>
            <LeftBar />
            <RightBar />
          </Icon>
          <TextWrapper>{ctaText}</TextWrapper>
          {pageAttachmentContainer &&
            isAnythingTransforming &&
            hasLinkInAttachmentArea && (
              <Popup
                anchor={{ current: pageAttachmentContainer }}
                isOpen={true}
                placement={'left'}
                spacing={spacing}
              >
                <Tooltip>
                  {__(
                    'Links can not be located below the dashline when a page attachment is present',
                    'web-stories'
                  )}
                </Tooltip>
              </Popup>
            )}
        </>
      )}
    </Wrapper>
  );
}

PageAttachment.propTypes = {
  pageAttachment: PropTypes.shape({
    url: PropTypes.string,
    ctaText: PropTypes.string,
  }),
};

export default PageAttachment;
