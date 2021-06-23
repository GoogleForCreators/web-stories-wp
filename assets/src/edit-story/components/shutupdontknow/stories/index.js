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
import { useState } from 'react';
import { THEME_CONSTANTS, Link, Tooltip } from '../../../../design-system';
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { THUMBNAIL_BG } from '../../thumbnail/stories/demoThumbnails';
import { CARD_TYPE } from '../../checklistCard/constants';
import { StyledVideoOptimizationIcon } from '../../checklistCard/styles';
import { DefaultCtaButton } from '../../checklistCard/defaultCtaButton';
import { DefaultFooterText } from '../../checklistCard/defaultFooterText';
import PanelThing from '..';
import { CheckboxCta } from '../../checklistCard/checkboxCta';
import { ChecklistCard } from '../../checklistCard';

export default {
  title: 'Stories Editor/Components/PanelThing',
  component: PanelThing,
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
      <PanelThing
        title={'High Priority'}
        isExpanded={openPanel === 'highPriority'}
        onClick={handleClick('highPriority')}
      >
        <ChecklistCard
          title="Add video captions"
          titleProps={{
            onClick: () => action('title clicked')(),
          }}
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
          thumbnail={
            <Thumbnail
              onClick={() => action('thumbnail action found')()}
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
          thumbnail={
            <>
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
            </>
          }
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
          thumbnail={
            <>
              <Thumbnail
                onClick={() => action('1 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('2 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('3 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('4 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
            </>
          }
        />
      </PanelThing>
      <PanelThing
        title={'Design'}
        isExpanded={openPanel === 'design'}
        onClick={handleClick('design')}
      >
        <ChecklistCard
          title="Add video captions"
          titleProps={{
            onClick: () => action('title clicked')(),
          }}
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
          thumbnail={
            <Thumbnail
              onClick={() => action('thumbnail action found')()}
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
          thumbnail={
            <>
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
            </>
          }
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
          thumbnail={
            <>
              <Thumbnail
                onClick={() => action('1 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('2 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('3 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('4 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
            </>
          }
        />
      </PanelThing>
      <PanelThing
        title={'Accessibility'}
        isExpanded={openPanel === 'accessibility'}
        onClick={handleClick('accessibility')}
      >
        <ChecklistCard
          title="Add video captions"
          titleProps={{
            onClick: () => action('title clicked')(),
          }}
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
          thumbnail={
            <Thumbnail
              onClick={() => action('thumbnail action found')()}
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
          thumbnail={
            <>
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
              <Thumbnail
                onClick={() => action('thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              />
            </>
          }
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
          thumbnail={
            <>
              <Thumbnail
                onClick={() => action('1 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('2 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('3 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
              <Thumbnail
                onClick={() => action('4 thumbnail action found')()}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
                aria-label="my helper text describing this thumbnail image"
              >
                <Tooltip title="Optimize">
                  <StyledVideoOptimizationIcon />
                </Tooltip>
              </Thumbnail>
            </>
          }
        />
      </PanelThing>
    </Container>
  );
};
