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
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackEvent } from '../../../../tracking';
import { TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS } from '../../../constants';
import {
  CardGridItem,
  CardPreviewContainer,
  CardGrid,
  FocusableGridItem,
} from '../../../components';
import {
  PageSizePropType,
  TemplatesPropType,
  TemplateActionsPropType,
} from '../../../types';
import { useGridViewKeys } from '../../../utils';
import { useConfig } from '../../config';

const GridContainer = styled(CardGrid)`
  width: ${({ theme }) =>
    `calc(100% - ${theme.standardViewContentGutter.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) =>
      `calc(100% - ${theme.standardViewContentGutter.min}px)`};
  }
`;

function TemplateGridView({ pageSize, templates, templateActions }) {
  const { isRTL } = useConfig();
  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});

  const [activeGridItemId, _setActiveGridItemId] = useState(null);

  const setActiveGridItemId = useCallback((id) => _setActiveGridItemId(id), []);

  const targetAction = useCallback(
    (template) => {
      return () => {
        trackEvent('dashboard', 'use_template', undefined, template.id);
        templateActions.createStoryFromTemplate(template);
      };
    },
    [templateActions]
  );

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activeGridItemId,
    items: templates,
  });

  // when keyboard focus changes through FocusableGridItem immediately focus the CardPreviewContainer
  useEffect(() => {
    itemRefs.current?.[activeGridItemId]?.lastChild.focus();
  }, [activeGridItemId]);

  return (
    <div ref={containerRef}>
      <GridContainer pageSize={pageSize} gridRef={gridRef}>
        {templates.map((template) => {
          const isActive = activeGridItemId === template.id;
          const tabIndex = isActive ? 0 : -1;
          return (
            <CardGridItem
              key={template.id}
              data-testid={`template-grid-item-${template.id}`}
              ref={(el) => {
                itemRefs.current[template.id] = el;
              }}
            >
              <FocusableGridItem
                onFocus={() => {
                  setActiveGridItemId(template.id);
                }}
                isSelected={isActive}
                tabIndex={tabIndex}
                aria-label={
                  isActive
                    ? sprintf(
                        /* translators: %s: template title.*/
                        __('Template %s (currently selected)', 'web-stories'),
                        template.title
                      )
                    : sprintf(
                        /* translators: %s: template title.*/
                        __('Template %s', 'web-stories'),
                        template.title
                      )
                }
              />
              <CardPreviewContainer
                tabIndex={tabIndex}
                pageSize={pageSize}
                story={template}
                centerAction={{
                  targetAction: template.centerTargetAction,
                  label:
                    TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS[
                      template.status
                    ],
                }}
                bottomAction={{
                  targetAction: targetAction(template),
                  label: __('Use template', 'web-stories'),
                }}
                containerAction={(e) =>
                  templateActions.handlePreviewTemplate(e, template)
                }
              />
            </CardGridItem>
          );
        })}
      </GridContainer>
    </div>
  );
}

TemplateGridView.propTypes = {
  pageSize: PageSizePropType,
  templates: TemplatesPropType,
  templateActions: TemplateActionsPropType,
};
export default TemplateGridView;
