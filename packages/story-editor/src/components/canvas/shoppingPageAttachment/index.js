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
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { OUTLINK_THEME } from '../../../constants';
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

const ArrowWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ bgColor }) => bgColor};
`;

// The CSS here is based on how it's displayed in the front-end, including static
// font-size, line-height, etc. independent of the viewport size -- it's not responsive.
const ArrowBar = styled(ArrowIcon)`
  display: block;
  cursor: pointer;
  margin: 12px 0 0 6px;
  filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.3));
  width: 20px;
  height: 8px;
`;

const OutlinkChip = styled.div`
  height: 36px;
  display: flex;
  position: relative;
  padding: 10px 6px;
  margin: 0 0 20px;
  max-width: calc(100% - 64px);
  border-radius: 30px;
  place-items: center;
  background: ${({ bgColor }) => bgColor};
`;

const TextWrapper = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 16px;
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

const LIGHT_COLOR = '#FFFFFF';
const DARK_COLOR = '#000000';

function PageAttachment({ ctaText = __('Shop Now', 'web-stories'), theme }) {
  const arrowColor = theme === OUTLINK_THEME.DARK ? LIGHT_COLOR : DARK_COLOR;
  const fgColor = theme === OUTLINK_THEME.DARK ? DARK_COLOR : LIGHT_COLOR;
  return (
    <Wrapper role="presentation">
      <>
        <ArrowWrap bgColor={fgColor}>
          <ArrowBar fill={arrowColor} />
        </ArrowWrap>
        <OutlinkChip>
          <TextWrapper fgColor={fgColor}>{ctaText}</TextWrapper>
        </OutlinkChip>
      </>
    </Wrapper>
  );
}

PageAttachment.propTypes = {
  ctaText: PropTypes.string,
  theme: PropTypes.string,
};

export default PageAttachment;
