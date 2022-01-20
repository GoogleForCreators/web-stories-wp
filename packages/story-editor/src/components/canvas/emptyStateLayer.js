/*
 * Copyright 2022 Google LLC
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
import {
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Button,
  Icons,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { __ } from '@web-stories-wp/i18n';
import { useRightClickMenu } from '../../app';
import useStory from '../../app/story/useStory';
import isEmptyStory from '../../app/story/utils/isEmptyStory';
import { Layer, PageArea } from './layout';

const DisplayPageArea = styled(PageArea)`
  position: absolute;
  z-index: 1;
`;

const EmptyStateMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
`;

function EmptyStateLayer() {
  const onOpenMenu = useRightClickMenu((value) => value.onOpenMenu);
  const { pages } = useStory(({ state: { pages } }) => ({
    pages,
  }));

  if (!isEmptyStory(pages)) {
    return null;
  }

  return (
    <Layer onContextMenu={onOpenMenu}>
      <DisplayPageArea withSafezone={false}>
        <EmptyStateMessage>
          <Button
            type={BUTTON_TYPES.SECONDARY}
            variant={BUTTON_VARIANTS.CIRCLE}
            onClick={onOpenMenu}
          >
            <Icons.Media />
          </Button>
          <p>
            {__(
              'Add an image, video or template to get started',
              'web-stories'
            )}
          </p>
        </EmptyStateMessage>
      </DisplayPageArea>
    </Layer>
  );
}

export default EmptyStateLayer;
