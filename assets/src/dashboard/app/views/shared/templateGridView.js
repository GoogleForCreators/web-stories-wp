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
import styled from 'styled-components';
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackEvent } from '../../../../tracking';
import { TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS } from '../../../constants';
import {
  CardGridItem,
  CardPreviewContainer,
  CardGrid,
} from '../../../components';
import {
  PageSizePropType,
  TemplatesPropType,
  TemplateActionsPropType,
} from '../../../types';

const GridContainer = styled(CardGrid)`
  width: ${({ theme }) =>
    `calc(100% - ${theme.standardViewContentGutter.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) =>
      `calc(100% - ${theme.standardViewContentGutter.min}px)`};
  }
`;

function TemplateGridView({ pageSize, templates, templateActions }) {
  const targetAction = useCallback(
    (template) => {
      return () => {
        trackEvent('dashboard', 'use_template', undefined, template.id);
        templateActions.createStoryFromTemplate(template);
      };
    },
    [templateActions]
  );

  return (
    <GridContainer pageSize={pageSize}>
      {templates.map((template) => (
        <CardGridItem
          key={template.id}
          data-testid={`template-grid-item-${template.id}`}
        >
          <CardPreviewContainer
            pageSize={pageSize}
            story={template}
            centerAction={{
              targetAction: template.centerTargetAction,
              label:
                TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS[template.status],
            }}
            bottomAction={{
              targetAction: targetAction(template),
              label: __('Use template', 'web-stories'),
            }}
            containerAction={() =>
              templateActions.handlePreviewTemplate(template)
            }
          />
        </CardGridItem>
      ))}
    </GridContainer>
  );
}

TemplateGridView.propTypes = {
  pageSize: PageSizePropType,
  templates: TemplatesPropType,
  templateActions: TemplateActionsPropType,
};
export default TemplateGridView;
