/*
 * Copyright 2021 Google LLC
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
/**
 * Internal dependencies
 */
import { themeHelpers, Text, THEME_CONSTANTS } from '../../../../design-system';
import { NAVIGATION_HEIGHT } from '../navigator/constants';
import { TranslateWithMarkup } from '../../../../i18n';
import { GUTTER_WIDTH } from '../constants';
import { Transitioner } from './transitioner';

const Panel = styled.div`
  width: 100%;
  padding-bottom: ${NAVIGATION_HEIGHT}px;
`;

const Overflow = styled.div`
  position: relative;
  width: 100%;
  max-height: 70vh;
  padding: ${GUTTER_WIDTH}px;

  strong {
    font-weight: 700;
  }

  .screenreader {
    position: absolute;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
  }
`;

// @TODO update with actual figure.
const Figure = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  height: 180px;
  margin-bottom: ${GUTTER_WIDTH}px;
`;

const Title = styled.h1`
  ${themeHelpers.expandTextPreset(({ label }, { MEDIUM }) => label[MEDIUM])}
  color: ${({ theme }) => theme.colors.fg.primary};
  line-height: 32px;
  margin: 0 0 8px 0;
`;

const Paragraph = styled(Text)`
  & + & {
    margin-top: 8px;
  }
`;

export function QuickTip({
  figureSrc,
  title,
  description,
  isLeftToRightTransition = true,
  ...transitionProps
}) {
  return (
    <Transitioner
      {...transitionProps}
      isLeftToRightTransition={isLeftToRightTransition}
    >
      <Panel>
        <Overflow>
          <Figure />
          <Title>{title}</Title>
          {description.map((paragraph, i) => (
            <Paragraph
              // eslint-disable-next-line react/no-array-index-key
              key={`${title}-${i}`}
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              <TranslateWithMarkup
                mapping={{
                  screenreader: <span className="screenreader" />,
                }}
              >
                {paragraph}
              </TranslateWithMarkup>
            </Paragraph>
          ))}
        </Overflow>
      </Panel>
    </Transitioner>
  );
}

QuickTip.propTypes = {
  figureSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLeftToRightTransition: PropTypes.bool,
};
