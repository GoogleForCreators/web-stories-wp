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
import { __, _x } from '@wordpress/i18n';
import { useCallback, createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { MouseEventHandler, MouseEvent } from 'react';
import { useConfig } from '../config';

import Paragraph from './paragraph';
import Link from './link';
import Number from './number';
import Image from './image';

const Wrapper = styled.div`
  display: none;
  margin-left: 30px;
  justify-content: center;

  @media ${({ theme }) => theme.breakpoint.desktop} {
    display: flex;
  }
`;

const ParagraphWrapper = styled.div`
  align-self: flex-start;
  margin: 20px 0 0 -50px;
`;

function Step3() {
  const { newStoryURL } = useConfig();

  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      void trackClick(event, 'open_story_editor');
    },
    []
  );

  // createInterpolateElement doesn't support br tags.
  const translatedString = createInterpolateElement(
    __('Jump into the <a>Editor</a>', 'web-stories'),
    {
      a: <Link href={newStoryURL} onClick={onClick} />,
    }
  );

  return (
    <Wrapper>
      <Link href={newStoryURL} onClick={onClick}>
        <Image
          name="editor.png"
          name2x="editor-2x.png"
          width={430}
          height={251}
        />
      </Link>
      <ParagraphWrapper>
        <Number>
          {
            /* translators: Number of the step displayed in plugin activation message. */
            _x('3', 'Step number', 'web-stories')
          }
        </Number>
        <Paragraph>{translatedString}</Paragraph>
      </ParagraphWrapper>
    </Wrapper>
  );
}

export default Step3;
