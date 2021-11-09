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
import { __, sprintf } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
} from '@web-stories-wp/design-system';
import { forwardRef } from '@web-stories-wp/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  DEFAULT_GRID_IMG_HEIGHT,
  DEFAULT_GRID_IMG_WIDTH,
  TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS,
} from '../../../../constants';
import { CardGridItem } from '../../../../components';
import { Container, Gradient, Scrim } from '../../shared/grid/components';
import {
  TemplateDisplayContent,
  CardWrapper,
  PicturePoster,
} from './components';

export const FOCUS_TEMPLATE_CLASS = 'focus_template';

const TemplateGridItem = forwardRef(
  (
    {
      detailLink,
      onCreateStory,
      onFocus,
      height,
      id,
      isActive,
      posterSrc,
      slug,
      title,
      status,
    },
    ref
  ) => {
    const tabIndex = isActive ? 0 : -1;
    const posterAltText = sprintf(
      /* translators: %s: Template title. */
      __('First page of %s template', 'web-stories'),
      title
    );
    return (
      <CardGridItem
        ref={ref}
        id={`template-grid-item-${id}`}
        className="templateGridItem"
        data-testid={`template-grid-item-${id}`}
        $posterHeight={height}
        onFocus={onFocus}
      >
        <Container>
          <CardWrapper $isSelected={isActive}>
            <PicturePoster>
              <source srcSet={posterSrc?.webp} type="image/webp" />
              <source srcSet={posterSrc?.png} type="image/png" />
              <img
                src={posterSrc?.png}
                alt={posterAltText}
                width={DEFAULT_GRID_IMG_WIDTH}
                height={DEFAULT_GRID_IMG_HEIGHT}
              />
            </PicturePoster>
            <Gradient />
            <Scrim
              data-testid="card-action-container"
              data-template-slug={slug}
            >
              <TemplateDisplayContent>
                <Button
                  size={BUTTON_SIZES.SMALL}
                  type={BUTTON_TYPES.SECONDARY}
                  as="a"
                  ariaLabel={sprintf(
                    /* translators: %s: template title.*/
                    __('Go to detail view of %s', 'web-stories'),
                    title
                  )}
                  href={detailLink}
                  disabled={!detailLink}
                  className={FOCUS_TEMPLATE_CLASS}
                  tabIndex={tabIndex}
                >
                  {TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS[status]}
                </Button>

                <Button
                  size={BUTTON_SIZES.SMALL}
                  type={BUTTON_TYPES.PRIMARY}
                  onClick={onCreateStory}
                  disabled={!onCreateStory}
                  tabIndex={tabIndex}
                  ariaLabel={sprintf(
                    /* translators: %s: template title.*/
                    __('Create new story from %s', 'web-stories'),
                    title
                  )}
                >
                  {__('Use template', 'web-stories')}
                </Button>
              </TemplateDisplayContent>
            </Scrim>
          </CardWrapper>
        </Container>
      </CardGridItem>
    );
  }
);

TemplateGridItem.displayName = 'TemplateGridItem';

TemplateGridItem.propTypes = {
  detailLink: PropTypes.string,
  onCreateStory: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  posterSrc: PropTypes.shape({
    webp: PropTypes.string.isRequired,
    png: PropTypes.string.isRequired,
  }),
  slug: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
export default TemplateGridItem;
