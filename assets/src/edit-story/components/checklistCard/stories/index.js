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
import { boolean, text } from '@storybook/addon-knobs';
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
} from '../../../../design-system';
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { THUMBNAIL_BG } from '../../thumbnail/stories/demoThumbnails';

export default {
  title: 'Stories Editor/Components/ChecklistCard',
  component: SingleIssueCard,
};

export const _default = () => {
  return (
    <SingleIssueCard
      title={text('title', 'issue title')}
      helper={
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
          Helper Text
        </Text>
      }
      cta={
        <Button size={BUTTON_SIZES.SMALL} type={BUTTON_TYPES.SECONDARY}>
          {'CTA'}
        </Button>
      }
      Thumbnail={
        <Thumbnail
          type={THUMBNAIL_TYPES.IMAGE}
          displayBackground={THUMBNAIL_BG[THUMBNAIL_TYPES.IMAGE]}
          aria-label="my helper text describing this thumbnail image"
        />
      }
    />
  );
};
