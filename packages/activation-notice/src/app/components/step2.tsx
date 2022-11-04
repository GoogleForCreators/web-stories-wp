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
import type { MouseEventHandler, MouseEvent } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { createInterpolateElement, useCallback } from '@wordpress/element';

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

function Step2() {
  const { dashboardURL } = useConfig();

  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (evt: MouseEvent<HTMLAnchorElement>) => {
      void trackClick(evt, 'open_dashboard');
    },
    []
  );

  // createInterpolateElement doesn't support br tags.
  const translatedString = createInterpolateElement(
    __('Head to the <a>Dashboard</a>', 'web-stories'),
    {
      a: <Link href={dashboardURL} onClick={onClick} />,
    }
  );

  return (
    <Wrapper>
      <Link href={dashboardURL} onClick={onClick}>
        <Image
          name="dashboard.png"
          name2x="dashboard-2x.png"
          width={420}
          height={246}
        />
      </Link>
      <ParagraphWrapper>
        <Number>
          {
            /* translators: Number of the step displayed in plugin activation message. */
            _x('2', 'Step number', 'web-stories')
          }
        </Number>
        <Paragraph $secondary>{translatedString}</Paragraph>
      </ParagraphWrapper>
    </Wrapper>
  );
}

export default Step2;
