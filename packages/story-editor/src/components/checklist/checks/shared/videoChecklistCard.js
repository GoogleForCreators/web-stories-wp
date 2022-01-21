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
import * as PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../../thumbnail';

function VideoChecklistCard({ elements, footer, onThumbnailClick, ...props }) {
  return (
    <ChecklistCard
      {...props}
      cardType={
        elements.length > 1 ? CARD_TYPE.MULTIPLE_ISSUE : CARD_TYPE.SINGLE_ISSUE
      }
      footer={<DefaultFooterText>{footer}</DefaultFooterText>}
      thumbnails={elements.map((element) => (
        <Thumbnail
          key={element.id}
          onClick={() => onThumbnailClick(element.id, element.pageId)}
          type={THUMBNAIL_TYPES.VIDEO}
          displayBackground={<LayerThumbnail page={element} />}
          aria-label={__('Go to offending video', 'web-stories')}
        />
      ))}
    />
  );
}

VideoChecklistCard.propTypes = {
  title: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  footer: PropTypes.string.isRequired,
  onThumbnailClick: PropTypes.func.isRequired,
};

export default VideoChecklistCard;
