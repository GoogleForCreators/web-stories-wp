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
  align-items: flex-end;

  @media ${({ theme }) => theme.breakpoint.desktop} {
    display: flex;
  }
`;

const Image = styled.img`
  margin-bottom: -25px;
`;

const ParagraphWrapper = styled.div`
  margin: 0 0 30px 25px;
`;

function Step3() {
  const { assetsURL, newStoryURL } = useConfig();

  const onClick = useCallback(
    (evt) => {
      trackClick(evt, 'activation-notice', newStoryURL);
    },
    [newStoryURL]
  );

  return (
    <Wrapper>
      <Link href={newStoryURL} onClick={onClick}>
        <Image
          src={`${assetsURL}images/plugin-activation/editor.png`}
          alt={__('Screenshot of the Web Stories Editor', 'web-stories')}
          width={320}
          height={180}
        />
      </Link>
      <ParagraphWrapper>
        <Number>
          {
            /* translators: Number of the step displayed in plugin activation message. */
            _x('3', 'Step number', 'web-stories')
          }
        </Number>
        <Paragraph>
          <Link href={newStoryURL} onClick={onClick}>
            {__('Jump into the editor', 'web-stories')}
          </Link>
        </Paragraph>
      </ParagraphWrapper>
    </Wrapper>
  );
}

export default Step3;
