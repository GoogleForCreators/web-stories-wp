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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackClick } from '../../../tracking';
import { useConfig } from '../config';

import Paragraph from './paragraph';
import Link from './link';
import Number from './number';

const Wrapper = styled.div`
  display: none;
  min-width: 300px;

  @media ${({ theme }) => theme.breakpoint.tabletSmall} {
    display: flex;
  }
`;

const Image = styled.img`
  transform: rotate(${(props) => props.$rotationAngle});
  margin-top: -35px;
`;

const ParagraphWrapper = styled.div`
  align-self: flex-end;
  margin-bottom: 15px;
`;

// @todo Support markup in translated strings - https://github.com/google/web-stories-wp/issues/1578
function Step1() {
  const { assetsURL, demoStoryURL, isRTL } = useConfig();

  const onClick = useCallback(
    (evt) => {
      trackClick(evt, 'open_demo_story', 'activation-notice', demoStoryURL);
    },
    [demoStoryURL]
  );

  return (
    <Wrapper>
      <Link
        href={demoStoryURL}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src={`${assetsURL}images/plugin-activation/tips.png`}
          alt=""
          width={170}
          height={300}
          $rotationAngle={isRTL ? '-10.57deg' : '10.57deg'}
        />
      </Link>
      <ParagraphWrapper>
        <Number>
          {
            /* translators: Number of the step displayed in plugin activation message. */
            _x('1', 'Step number', 'web-stories')
          }
        </Number>
        <Paragraph $secondary>
          {
            /* translators: First half of "Read the Get Started story" */
            _x('Read the', 'plugin activation', 'web-stories')
          }
          <br />
          <Link
            href={demoStoryURL}
            onClick={onClick}
            target="_blank"
            rel="noreferrer"
          >
            {__('Get Started story', 'web-stories')}
          </Link>
        </Paragraph>
      </ParagraphWrapper>
    </Wrapper>
  );
}

export default Step1;
