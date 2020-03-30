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

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalCreateInterpolateElement as createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../app/config';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../../constants';

const DialogSection = styled.div`
  padding: 0px 16px;
  min-width: 260px;

  h3 {
    margin: 0px;
    font-family: ${({ theme }) => theme.fonts.body1.family};
    font-size: ${({ theme }) => theme.fonts.body1.size};
    line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
    letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
    font-weight: bold;
    color: ${({ theme }) => rgba(theme.colors.fg.v0, 0.68)};
  }

  b {
    font-weight: bold;
  }

  p {
    font-family: ${({ theme }) => theme.fonts.body1.family};
    font-size: ${({ theme }) => theme.fonts.body1.size};
    line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
    letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  }

  mark {
    background-color: ${({ theme }) => theme.colors.textHighlight};
  }
`;

const DialogSeparator = styled.div`
  margin-right: 42px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;
  flex: 1;
`;

function BackgroundDisplayDialogContent() {
  const { pluginDir } = useConfig();

  return (
    <>
      <Row>
        {sprintf(
          /* translators: %s: page width x height */
          __(
            'Your story is created at one aspect ratio (%s). When published, users will view your stories using phones with aspect ratios that may differ widely.',
            'web-stories'
          ),
          `${PAGE_WIDTH} x ${PAGE_HEIGHT}`
        )}
      </Row>

      <Row>
        <img
          alt={__('Fit to device', 'web-stories')}
          src={`${pluginDir}assets/images/fit-to-device.png`}
        />
        <DialogSection>
          <h3>{__('Fit to device', 'web-stories')}</h3>
          <p>
            {__(
              'All background images in your stories will be scaled to fill the screen for all mobile devices.',
              'web-stories'
            )}
          </p>
          <p>
            {__(
              'Use this option if resizing the background image is not an issue.',
              'web-stories'
            )}
          </p>
        </DialogSection>
        <DialogSeparator />
        <img
          alt={__('Do not fit', 'web-stories')}
          src={`${pluginDir}assets/images/do-not-fit.png`}
        />
        <DialogSection>
          <h3>{__('Do not fit', 'web-stories')}</h3>
          <p>
            {createInterpolateElement(
              __(
                'Your story will be centered vertically on the device. The <b>page’s background color</b> will cover any additional space. <mark>For better visual results, set the page background color to match the color of the background image.</mark>',
                'web-stories'
              ),
              {
                b: <b />,
                mark: <mark />,
              }
            )}
          </p>
          <p>
            {__(
              'Use this option if you need elements to be precisely aligned to the background.',
              'web-stories'
            )}
          </p>
        </DialogSection>
      </Row>
    </>
  );
}

export default BackgroundDisplayDialogContent;
