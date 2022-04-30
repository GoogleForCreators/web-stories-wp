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
import styled from 'styled-components';
import {
  THEME_CONSTANTS,
  Text,
  Link,
  List,
  BaseTooltip,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { THUMBNAIL_BG } from '../../thumbnail/stories/demoThumbnails';
import { CARD_TYPE } from '../constants';
import { CardListWrapper, StyledVideoOptimizationIcon } from '../styles';
import { DefaultCtaButton } from '../defaultCtaButton';
import { DefaultFooterText } from '../defaultFooterText';
import { ChecklistCard } from '..';
import { CheckboxCta } from '../checkboxCta';

export default {
  title: 'Stories Editor/Components/ChecklistCard',
  component: ChecklistCard,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
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
  const getThumbnails = (numOfThumbnails) => {
    const thumbnails = [];
    let index = 0;
    while (numOfThumbnails > index) {
      thumbnails.push(
        <Thumbnail
          key={index}
          type={THUMBNAIL_TYPES.IMAGE}
          displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
          aria-label="my helper text describing this thumbnail image"
        >
          <BaseTooltip title="Optimize">
            <StyledVideoOptimizationIcon />
          </BaseTooltip>
        </Thumbnail>
      );
      index++;
    }
    return thumbnails;
  };

  return (
    <Container>
      <div>
        <Text>{'Single Issue'}</Text>
        <ChecklistCard
          title="Add video captions"
          footer={
            <DefaultFooterText>
              {
                'Keep the audience engaged even when they can’t listen to the audio. '
              }
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          cta={<DefaultCtaButton>{'Replace File'}</DefaultCtaButton>}
          thumbnailCount={1}
          thumbnails={getThumbnails(1)}
        />
      </div>
      <div>
        <Text>{'Single Issue - No CTA'}</Text>
        <ChecklistCard
          title="Add video captions"
          footer={
            <DefaultFooterText>
              {
                'Keep the audience engaged even when they can’t listen to the audio. '
              }
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          thumbnailCount={1}
          thumbnails={getThumbnails(1)}
        />
      </div>
      <div>
        <Text>{'Single Issue - No Thumbnail'}</Text>
        <ChecklistCard
          title="Increase size of publisher logo to at least 96x96px"
          footer={
            <DefaultFooterText>
              {'Maintain a 1:1 aspect ratio. '}
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          cta={<DefaultCtaButton>{'Replace File'}</DefaultCtaButton>}
        />
      </div>
      <div>
        <Text>{'Single Issue - No Thumbnail or CTA'}</Text>
        <ChecklistCard
          title="Add Web Story title"
          footer={
            <DefaultFooterText>
              {'Keep title under 40 characters. '}
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
        />
      </div>
      <div>
        <Text>{'Single Issue - No Thumbnail with a list'}</Text>
        <ChecklistCard
          title="Add Web Story poster image"
          footer={
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
          cta={<DefaultCtaButton>{'Upload'}</DefaultCtaButton>}
        />
      </div>
      <div>
        <Text>{'Multiple Issues - No CTA'}</Text>
        <ChecklistCard
          title="Add video captions"
          footer={
            <DefaultFooterText>
              {
                'Keep the audience engaged even when they can’t listen to the audio. '
              }
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          cardType={CARD_TYPE.MULTIPLE_ISSUE}
          thumbnailCount={3}
          thumbnails={getThumbnails(3)}
        />
      </div>
      <div>
        <Text>{'Multiple Issues'}</Text>
        <ChecklistCard
          title="Add video captions"
          cta={<DefaultCtaButton>{'Fix everything'}</DefaultCtaButton>}
          footer={
            <DefaultFooterText>
              {
                'Keep the audience engaged even when they can’t listen to the audio. '
              }
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          cardType={CARD_TYPE.MULTIPLE_ISSUE}
          thumbnailCount={3}
          thumbnails={getThumbnails(3)}
        />
      </div>

      <div>
        <Text>{'Multiple Issues - 4'}</Text>
        <ChecklistCard
          title="Videos not optimized"
          cta={
            <>
              <DefaultCtaButton aria-label={'Optimize all 6 videos'}>
                {'Optimize all videos'}
              </DefaultCtaButton>
              <CheckboxCta
                id="demo-optimize"
                aria-label="check this box to optimize videos by default"
              >
                {'Enable auto optimization'}
              </CheckboxCta>
            </>
          }
          footer={
            <DefaultFooterText>
              {'Unoptimized video may cause playback issues. '}
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          cardType={CARD_TYPE.MULTIPLE_ISSUE}
          thumbnailCount={4}
          thumbnails={getThumbnails(4)}
        />
      </div>

      <div>
        <Text>{'Video Optimization - more than 4'}</Text>
        <ChecklistCard
          title="Videos not optimized"
          cta={
            <>
              <DefaultCtaButton>{'Optimize all videos'}</DefaultCtaButton>
              <CheckboxCta
                id="demo-optimize"
                aria-label="check this box to optimize videos by default"
              >
                {'Enable auto optimization'}
              </CheckboxCta>
            </>
          }
          footer={
            <DefaultFooterText>
              {'Unoptimized video may cause playback issues. '}
              <Link
                href="/demo"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >
                {'Learn more'}
              </Link>
            </DefaultFooterText>
          }
          cardType={CARD_TYPE.MULTIPLE_ISSUE}
          thumbnailCount={6}
          thumbnails={getThumbnails(6)}
        />
      </div>
    </Container>
  );
};
