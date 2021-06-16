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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import SingleIssueCard from '..';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  THEME_CONSTANTS,
  Text,
  Link,
  List,
} from '../../../../design-system';
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { THUMBNAIL_BG } from '../../thumbnail/stories/demoThumbnails';
import { CardListWrapper } from '../helpers/cardListWrapper';

export default {
  title: 'Stories Editor/Components/ChecklistCard',
  component: SingleIssueCard,
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  width: 900px;

  & > div {
    margin: 0 8px 16px;
  }
`;

export const _default = () => {
  return (
    <Container>
      <div>
        <Text>{'Single Issue'}</Text>
        <SingleIssueCard
          title="Add video captions"
          titleProps={{
            onClick: () => action('title clicked')(),
            onkeydown: () => action('keydown')(),
          }}
          helper={
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {
                'Keep the audience engaged even when they can’t listen to the audio. '
              }
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </Text>
          }
          cta={
            <Button size={BUTTON_SIZES.SMALL} type={BUTTON_TYPES.SECONDARY}>
              {'Replace File'}
            </Button>
          }
          thumbnailCount={1}
          Thumbnail={
            <Thumbnail
              onClick={() => action('thumbnail action found')()}
              type={THUMBNAIL_TYPES.IMAGE}
              displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
              aria-label="my helper text describing this thumbnail image"
            />
          }
        />
      </div>
      <div>
        <Text>{'Single Issue - No CTA'}</Text>
        <SingleIssueCard
          title="Add video captions"
          helper={
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {
                'Keep the audience engaged even when they can’t listen to the audio. '
              }
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </Text>
          }
          thumbnailCount={1}
          Thumbnail={
            <Thumbnail
              onClick={() => action('thumbnail action found')()}
              type={THUMBNAIL_TYPES.IMAGE}
              displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
              aria-label="my helper text describing this thumbnail image"
            />
          }
        />
      </div>
      <div>
        <Text>{'Single Issue - No Thumbnail'}</Text>
        <SingleIssueCard
          title="Increase size of publisher logo to at least 96x96px"
          helper={
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {'Maintain a 1:1 aspect ratio. '}
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </Text>
          }
          cta={
            <Button size={BUTTON_SIZES.SMALL} type={BUTTON_TYPES.SECONDARY}>
              {'Replace File'}
            </Button>
          }
        />
      </div>
      <div>
        <Text>{'Single Issue - No Thumbnail or CTA'}</Text>
        <SingleIssueCard
          title="Add Web Story title"
          helper={
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {'Keep title under 40 characters. '}
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </Text>
          }
        />
      </div>
      <div>
        <Text>{'Single Issue - No Thumbnail with a list'}</Text>
        <SingleIssueCard
          title="Add Web Story poster image"
          helper={
            <CardListWrapper>
              <List>
                <li>{'Use as a representation of the story.'}</li>
                <li>{'Avoid images with embedded text.'}</li>
                <li>{"Use an image that's at least 640x853px."}</li>
                <li>{'Maintain a 3:4 aspect ratio.'}</li>
              </List>

              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </CardListWrapper>
          }
          cta={
            <Button size={BUTTON_SIZES.SMALL} type={BUTTON_TYPES.SECONDARY}>
              {'Upload'}
            </Button>
          }
        />
      </div>
    </Container>
  );
};
