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
import Image from './image';

const Wrapper = styled.div`
  display: none;
  margin-left: 20px;
  justify-content: center;

  @media ${({ theme }) => theme.breakpoint.tabletLarge} {
    display: flex;
  }
`;

const ParagraphWrapper = styled.div`
  align-self: flex-start;
  margin: 20px 0 0 -50px;
  min-width: 100px;
`;

// @todo Support markup in translated strings - https://github.com/google/web-stories-wp/issues/1578
function Step2() {
  const { dashboardURL } = useConfig();

  const onClick = useCallback(
    (evt) => {
      trackClick(evt, 'open_dashboard', 'activation-notice', dashboardURL);
    },
    [dashboardURL]
  );

  return (
    <Wrapper>
      <Link href={dashboardURL} onClick={onClick}>
        <Image
          name="dashboard.png"
          name2x="dashboard-2x.png"
          width={420}
          height={246}
          $marginTop={60}
        />
      </Link>
      <ParagraphWrapper>
        <Number>
          {
            /* translators: Number of the step displayed in plugin activation message. */
            _x('2', 'Step number', 'web-stories')
          }
        </Number>
        <Paragraph $secondary>
          {
            /* translators: First half of "Head to the Dashboard" */
            _x('Head to the', 'plugin activation', 'web-stories')
          }
          <br />
          <Link href={dashboardURL} onClick={onClick}>
            {__('Dashboard', 'web-stories')}
          </Link>
        </Paragraph>
      </ParagraphWrapper>
    </Wrapper>
  );
}

export default Step2;
