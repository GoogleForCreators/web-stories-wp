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
  flex-direction: column;
  align-items: center;

  @media ${({ theme }) => theme.breakpoint.tabletLarge} {
    display: flex;
  }
`;

const Image = styled.img``;

const ParagraphWrapper = styled.div`
  margin-top: -40px;
`;

// @todo Support markup in translated strings - https://github.com/google/web-stories-wp/issues/1578
function Step2() {
  const { assetsURL, dashboardURL } = useConfig();

  const onClick = useCallback(
    (evt) => {
      trackClick(evt, 'activation-notice', dashboardURL);
    },
    [dashboardURL]
  );

  return (
    <Wrapper>
      <ParagraphWrapper>
        <Number>{2}</Number>
        <Paragraph $secondary>
          {
            /* translators: First half of Head to the Dashboard" */
            _x('Head to', 'plugin activation', 'web-stories')
          }
          <br />
          <Link href={dashboardURL} onClick={onClick}>
            {__('Dashboard', 'web-stories')}
          </Link>
        </Paragraph>
      </ParagraphWrapper>
      <Link href={dashboardURL} onClick={onClick}>
        <Image
          src={`${assetsURL}images/plugin-activation/dashboard.png`}
          alt={__('Screenshot of the Web Stories Dashboard', 'web-stories')}
          width={320}
          height={190}
        />
      </Link>
    </Wrapper>
  );
}

export default Step2;
