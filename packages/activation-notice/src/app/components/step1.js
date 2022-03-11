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
import { trackClick } from '@googleforcreators/tracking';

/**
 * WordPress dependencies
 */
import { createInterpolateElement, useCallback } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';

import Paragraph from './paragraph';
import Link from './link';
import Number from './number';
import Image from './image';

const Wrapper = styled.div`
  display: none;
  min-width: 300px;
  justify-content: center;

  @media ${({ theme }) => theme.breakpoint.tabletSmall} {
    display: flex;
  }
`;

const ParagraphWrapper = styled.div`
  align-self: flex-start;
  margin: 20px 0 0 70px;
  text-align: right;
  min-width: 100px;

  @media ${({ theme }) => theme.breakpoint.desktop} {
    margin-left: 30px;
  }
`;

function Step1() {
  const { demoStoryURL } = useConfig();

  const onClick = useCallback((evt) => {
    trackClick(evt, 'open_demo_story');
  }, []);

  // createInterpolateElement doesn't support br tags.
  const translatedString = createInterpolateElement(
    __('Read the <a>Get Started story</a>', 'web-stories'),
    {
      a: <Link href={demoStoryURL} onClick={onClick} target="_blank" />,
    }
  );

  return (
    <Wrapper>
      <Link href={demoStoryURL} onClick={onClick} target="_blank">
        <Image
          name="tips.png"
          name2x="tips-2x.png"
          width={150}
          height={245}
          $marginTop={60}
        />
      </Link>
      <ParagraphWrapper>
        <Number>
          {
            /* translators: Number of the step displayed in plugin activation message. */
            _x('1', 'Step number', 'web-stories')
          }
        </Number>
        <Paragraph $secondary>{translatedString}</Paragraph>
      </ParagraphWrapper>
    </Wrapper>
  );
}

export default Step1;
