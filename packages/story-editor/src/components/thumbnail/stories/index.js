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
import { BaseTooltip, Icons } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { Thumbnail, THUMBNAIL_TYPES } from '..';
import { THUMBNAIL_BG } from './demoThumbnails';

export default {
  title: 'Stories Editor/Components/Thumbnail',
  component: Thumbnail,
  args: {
    isError: false,
    isLoading: false,
    loadingMessage: 'some aria specific loading copy',
    ariaLabel:
      'I am some helper text for screen readers. If a tooltip is present, that content should also go here',
  },
  argTypes: {
    onClick: { action: 'button clicked' },
  },
  parameters: {
    controls: {
      exclude: ['displayBackground', 'type', 'children'],
    },
  },
};
const Container = styled.div`
  background-color: #28292b;
  padding: 30px;
  display: flex;
  gap: 20px;
`;

const StyledVideoOptimizationIcon = styled(Icons.GearWithGauge)`
  rect {
    color: ${({ theme }) => theme.colors.opacity.black64};
  }

  path {
    color: ${({ theme }) => theme.colors.fg.primary};
  }
`;

export const _default = (args) => {
  const thumbnails = Object.values(THUMBNAIL_TYPES).map((thumbnailType) => (
    <Thumbnail
      key={`${thumbnailType}_key`}
      type={thumbnailType}
      displayBackground={THUMBNAIL_BG[thumbnailType]}
      {...args}
      aria-label={args.ariaLabel}
      onClick={() => args.onClick(thumbnailType)}
    >
      {thumbnailType === THUMBNAIL_TYPES.VIDEO && (
        <BaseTooltip title="test tooltip">
          <StyledVideoOptimizationIcon />
        </BaseTooltip>
      )}
    </Thumbnail>
  ));

  return <Container>{thumbnails}</Container>;
};
