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
  Link,
  Tooltip,
  Text,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useState } from '@googleforcreators/react';
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { THUMBNAIL_BG } from '../../thumbnail/stories/demoThumbnails';
import { CARD_TYPE } from '../../checklistCard/constants';
import { StyledVideoOptimizationIcon } from '../../checklistCard/styles';
import { DefaultCtaButton } from '../../checklistCard/defaultCtaButton';
import { DefaultFooterText } from '../../checklistCard/defaultFooterText';
import { Tablist } from '../styles';
import TablistPanel from '../tablistPanel';
import { CheckboxCta } from '../../checklistCard/checkboxCta';
import { ChecklistCard } from '../../checklistCard';
import { PANEL_STATES } from '../constants';

export default {
  title: 'Stories Editor/Components/Tablist',
  component: Tablist,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 16px;
  width: 900px;
  height: 900px;

  ${Tablist} {
    grid-row-start: 2;
    grid-row-end: 3;
  }
`;

export const _default = () => {
  const [openPanel, setOpenPanel] = useState(false);

  const handleClick = (title) => () => {
    setOpenPanel((currentlyOpenPanel) => {
      if (currentlyOpenPanel === title) {
        return null;
      }

      return title;
    });
  };

  return (
    <Container>
      <Text>{'Scroll Down or collapse actions bar to see the tabs'}</Text>
      <Tablist aria-label={'Pre publish checklist example'}>
        <TablistPanel
          title={'High Priority'}
          isExpanded={openPanel === 'highPriority'}
          onClick={handleClick('highPriority')}
          badgeCount={3}
          status={PANEL_STATES.DANGER}
        >
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
            thumbnails={
              <Thumbnail
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
            }
          />
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
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
            ]}
          />
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
            thumbnailCount={6}
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={4}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
            ]}
          />
        </TablistPanel>
        <TablistPanel
          title={'Style'}
          isExpanded={openPanel === 'design'}
          onClick={handleClick('design')}
          badgeCount={1}
        >
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
            thumbnailCount={6}
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={4}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
            ]}
          />
        </TablistPanel>
        <TablistPanel
          title={'Accessibility'}
          isExpanded={openPanel === 'accessibility'}
          onClick={handleClick('accessibility')}
          badgeCount={9}
        >
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
            thumbnails={
              <Thumbnail
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
            }
          />
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
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
            ]}
          />
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
            thumbnailCount={6}
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={4}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
            ]}
          />
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
            thumbnails={
              <Thumbnail
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
            }
          />
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
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
            ]}
          />
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
            thumbnailCount={6}
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={4}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
            ]}
          />
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
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
            ]}
          />
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
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />,
            ]}
          />
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
            thumbnailCount={6}
            thumbnails={[
              <Thumbnail
                key={1}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={2}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={3}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
              <Thumbnail
                key={4}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>,
            ]}
          />
        </TablistPanel>
      </Tablist>
    </Container>
  );
};
