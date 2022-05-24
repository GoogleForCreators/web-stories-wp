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
import { useUnits } from '@googleforcreators/units';

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

const InnerWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Inner = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(0, rgba(0, 0, 0, 0.15), transparent) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ArrowWrap = styled.div`
  width: ${({ $factor }) => $factor(32)}px;
  min-height: ${({ $factor }) => $factor(32)}px;
  border-radius: 50%;
  background: ${({ bgColor }) => bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// The CSS here is based on how it's displayed in the front-end, including static
// font-size, line-height, etc. independent of the viewport size -- it's not responsive.
const ArrowBar = styled(ArrowIcon)`
  display: block;
  cursor: pointer;
  filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.3));
  width: ${({ $factor }) => $factor(20)}px;
  height: ${({ $factor }) => $factor(8)}px;
`;

const OutlinkChip = styled.div`
  height: ${({ $factor }) => $factor(36)}px;
  display: flex;
  position: relative;
  padding: ${({ $factor }) => $factor(10)}px ${({ $factor }) => $factor(6)}px;
  margin: 0 0 ${({ $factor }) => $factor(20)}px;
  max-width: calc(100% - 64px);
  border-radius: 30px;
  place-items: center;
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
  height: ${({ $factor }) => $factor(16)}px;
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

  const { dataToEditorY } = useUnits(({ actions: { dataToEditorY } }) => ({
    dataToEditorY,
  }));

  return (
    <Wrapper role="presentation">
      <InnerWrap>
        <Inner>
          <ArrowWrap bgColor={fgColor} $factor={dataToEditorY}>
            <ArrowBar fill={arrowColor} $factor={dataToEditorY} />
          </ArrowWrap>
          <OutlinkChip $factor={dataToEditorY}>
            <TextWrapper fgColor={fgColor} $factor={dataToEditorY}>
              {ctaText}
            </TextWrapper>
          </OutlinkChip>
        </Inner>
      </InnerWrap>
    </Wrapper>
  );
}

PageAttachment.propTypes = {
  ctaText: PropTypes.string,
  theme: PropTypes.string,
};

export default PageAttachment;
