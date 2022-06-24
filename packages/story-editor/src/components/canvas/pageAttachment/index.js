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
import { PLACEMENT, Popup } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useUnits } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../../app';
import useElementsWithLinks from '../../../utils/useElementsWithLinks';
import { OUTLINK_THEME } from '../../../constants';
import DefaultIcon from './icons/defaultIcon.svg';
import ArrowIcon from './icons/arrowBar.svg';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  bottom: 0;
  height: 20%;
  width: 100%;
  color: ${({ theme }) => theme.colors.standard.white};
  z-index: 3;
`;

const Guideline = styled.div`
  mix-blend-mode: difference;
  position: absolute;
  height: 1px;
  bottom: 20%;
  width: 100%;
  background-image: ${({ theme }) =>
    `linear-gradient(to right, ${theme.colors.standard.black} 50%, ${theme.colors.standard.white} 0%)`};
  background-position: top;
  background-size: 16px 0.5px;
  background-repeat: repeat-x;
  z-index: 3;
`;

// The CSS here is based on how it's displayed in the front-end, including static
// font-size, line-height, etc. independent of the viewport size -- it's not responsive.
const ArrowBar = styled(ArrowIcon)`
  display: block;
  cursor: pointer;
  margin-bottom: 10px;
  filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.3));
  width: 20px;
  height: 8px;
`;

const OutlinkChip = styled.div`
  height: ${({ $factor }) => $factor(36)}px;
  display: flex;
  position: relative;
  padding: ${({ $factor }) => $factor(10)}px ${({ $factor }) => $factor(6)}px;
  margin: 0 0 20px;
  max-width: calc(100% - 64px);
  border-radius: 30px;
  place-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  background: ${({ bgColor }) => bgColor};
`;

const TextWrapper = styled.span`
  font-family: Roboto, sans-serif;
  font-size: ${({ $factor }) => $factor(16)}px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  padding-inline-start: 6px;
  padding-inline-end: 8px;
  height: 16px;
  letter-spacing: 0.3px;
  font-weight: 700;
  max-width: 210px;
  color: ${({ fgColor }) => fgColor};
`;

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.standard.black};
  color: ${({ theme }) => theme.colors.standard.white};
  width: 200px;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
`;

const LinkImage = styled.img`
  height: 24px;
  width: 24px;
  vertical-align: middle;
  border-radius: 50%;
  border: 0 none;
`;

const spacing = { x: 8 };

const LIGHT_COLOR = '#FFFFFF';
const DARK_COLOR = '#000000';

function PageAttachment({ pageAttachment = {} }) {
  const {
    displayLinkGuidelines,
    pageAttachmentContainer,
    setPageAttachmentContainer,
  } = useCanvas((state) => ({
    displayLinkGuidelines: state.state.displayLinkGuidelines,
    pageAttachmentContainer: state.state.pageAttachmentContainer,
    setPageAttachmentContainer: state.actions.setPageAttachmentContainer,
  }));

  const { dataToEditorY } = useUnits(({ actions: { dataToEditorY } }) => ({
    dataToEditorY,
  }));

  const { hasInvalidLinkSelected } = useElementsWithLinks();

  const { ctaText, url, icon, theme } = pageAttachment;
  const bgColor = theme === OUTLINK_THEME.DARK ? DARK_COLOR : LIGHT_COLOR;
  const fgColor = theme === OUTLINK_THEME.DARK ? LIGHT_COLOR : DARK_COLOR;
  return (
    <>
      {(displayLinkGuidelines || hasInvalidLinkSelected) && <Guideline />}
      <Wrapper role="presentation" ref={setPageAttachmentContainer}>
        {url?.length > 0 && (
          <>
            <ArrowBar fill={bgColor} />
            <OutlinkChip bgColor={bgColor} $factor={dataToEditorY}>
              {icon ? (
                <LinkImage
                  src={icon}
                  alt={__('Attachment Icon', 'web-stories')}
                  decoding="async"
                  crossOrigin="anonymous"
                />
              ) : (
                <DefaultIcon
                  fill={fgColor}
                  width={dataToEditorY(24)}
                  height={dataToEditorY(24)}
                />
              )}
              <TextWrapper fgColor={fgColor} $factor={dataToEditorY}>
                {ctaText || __('Learn more', 'web-stories')}
              </TextWrapper>
            </OutlinkChip>
            {pageAttachmentContainer && hasInvalidLinkSelected && (
              <Popup
                anchor={{ current: pageAttachmentContainer }}
                isOpen
                placement={PLACEMENT.LEFT}
                spacing={spacing}
              >
                <Tooltip>
                  {__(
                    'Links can not reside below the dashed line when a page attachment is present. Your viewers will not be able to click on the link.',
                    'web-stories'
                  )}
                </Tooltip>
              </Popup>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
}

PageAttachment.propTypes = {
  pageAttachment: PropTypes.shape({
    url: PropTypes.string,
    ctaText: PropTypes.string,
    icon: PropTypes.string,
    theme: PropTypes.string,
    rel: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default PageAttachment;
