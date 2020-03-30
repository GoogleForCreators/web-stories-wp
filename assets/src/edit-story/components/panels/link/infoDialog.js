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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalCreateInterpolateElement as createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../app/config';

const TwoTapFigure = styled.img`
  min-width: 249px;
`;

const OneTapFigure = styled.img`
  min-width: 249px;
`;

const InfoPaneContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 32px;
`;
const InfoPane = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const InfoText = styled.div`
  min-width: 180px;
  margin-left: -48px;

  b {
    display: block;
    margin-bottom: 12px;
  }
`;

function LinkInfoDialog() {
  const { pluginDir } = useConfig();

  return (
    <>
      <span>
        {createInterpolateElement(
          __(
            'Select any element <b>(excluding a background or fullbleed element)</b>  and enter a web address. Drag your element around to convert between a 2-tap and 1-tap link.',
            'web-stories'
          ),
          {
            b: <b />,
          }
        )}
      </span>
      <InfoPaneContainer>
        <InfoPane>
          <TwoTapFigure src={`${pluginDir}assets/images/two-tap-link.png`} />
          <InfoText>
            <b>{__('2-Tap link', 'web-stories')}</b>
            <span>
              {__(
                'A 2-tap link opens up a tooltip containing a button that links out to your web address. 2-tap links must be found inside the green box.',
                'web-stories'
              )}
            </span>
          </InfoText>
        </InfoPane>
        <InfoPane>
          <OneTapFigure src={`${pluginDir}assets/images/one-tap-link.png`} />
          <InfoText style={{ minWidth: 220 }}>
            <b>{__('1-Tap link', 'web-stories')}</b>
            <span>
              {__(
                '1-tap links only require a single tap to link out to your web address but must be found inside the green box at the bottom of the page. You can have as many 1-tap link inside the box as you want but we recommend 1-2 at most.',
                'web-stories'
              )}
            </span>
          </InfoText>
        </InfoPane>
      </InfoPaneContainer>
    </>
  );
}

export default LinkInfoDialog;
