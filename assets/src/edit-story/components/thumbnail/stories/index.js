/*
 * Copyright 2021 Google LLC
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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import styled from 'styled-components';
import { Fragment } from 'react';

/**
 * Internal dependencies
 */
import { Tooltip, Text, Icons } from '../../../../design-system';
import { Thumbnail, THUMBNAIL_TYPES } from '..';
import { THUMBNAIL_BG } from './demoThumbnails';

export default {
  title: 'Stories Editor/Components/Thumbnail',
  component: Thumbnail,
};
const Container = styled.div`
  background-color: #28292b;
  padding: 30px;
  display: flex;
  gap: 20px;
`;

export const _default = () => {
  const thumbnails = Object.values(THUMBNAIL_TYPES).map((thumbnailType) => (
    <Fragment key={thumbnailType}>
      <Text>{thumbnailType}</Text>
      <Thumbnail
        type={thumbnailType}
        displayBackground={THUMBNAIL_BG[thumbnailType]}
        isError={boolean(`${thumbnailType}_isError`, false)}
        aria-label={text(
          `${thumbnailType}_aria-label`,
          'I am some helper text for screen readers. If a tooltip is present, that content should also go here'
        )}
        handleClick={() => action(`${thumbnailType} button clicked`)()}
      >
        {thumbnailType === THUMBNAIL_TYPES.VIDEO && (
          <Tooltip title="test tooltip">
            <Icons.Gear />
          </Tooltip>
        )}
      </Thumbnail>
    </Fragment>
  ));

  return <Container>{thumbnails}</Container>;
};
