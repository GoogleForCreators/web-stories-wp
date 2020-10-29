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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Internal dependencies
 */
import {
  CardGrid,
  CardGridItem,
  CardTitle,
  CardPreviewContainer,
  // ActionLabel,
  StoryMenu,
  FocusableGridItem,
} from '../../../components';
import {
  StoryMenuPropType,
  PageSizePropType,
  TemplatesPropType,
  TemplateActionsPropType,
} from '../../../types';
import { STORY_STATUS } from '../../../constants';
import { getRelativeDisplayDate } from '../../../../date';
import { useGridViewKeys, useFocusOut } from '../../../utils';
import { useConfig } from '../../config';
import { generateStoryMenu } from '../../../components/popoverMenu/story-menu-generator';
import { trackEvent } from '../../../../tracking';

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoryGrid = styled(CardGrid)`
  width: ${({ theme }) =>
    `calc(100% - ${theme.internalTheme.standardViewContentGutter.desktop}px)`};

  @media ${({ theme }) => theme.internalTheme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) =>
      `calc(100% - ${theme.internalTheme.standardViewContentGutter.min}px)`};
  }
`;

const SavedTemplateGridView = ({
  templates,
  centerActionLabelByStatus,
  // bottomActionLabel,
  pageSize,
  templateMenu,
  actions,
  initialFocusId = null,
}) => {
  const { isRTL } = useConfig();
  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});
  const [activeGridItemId, setActiveGridItemId] = useState(initialFocusId);

  // eslint-disable-next-line no-unused-vars
  const bottomTargetAction = useCallback(
    (template) => {
      return async () => {
        await trackEvent(
          'use_saved_template',
          'dashboard',
          template.title,
          template.id
        );
        actions.createStoryFromTemplate(template);
      };
    },
    [actions]
  );

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activeGridItemId,
    items: templates,
  });

  // when keyboard focus changes through FocusableGridItem immediately focus the edit preview layer on top of preview
  useEffect(() => {
    if (activeGridItemId) {
      itemRefs.current?.[activeGridItemId]?.children[2].focus();
    }
  }, [activeGridItemId]);

  useFocusOut(containerRef, () => setActiveGridItemId(null), []);

  return (
    <div ref={containerRef}>
      <StoryGrid
        pageSize={pageSize}
        ref={gridRef}
        role="list"
        ariaLabel={__('Viewing saved templates', 'web-stories')}
      >
        {templates.map((template) => {
          const isActive = activeGridItemId === template.id;
          const tabIndex = isActive ? 0 : -1;

          return (
            <CardGridItem
              key={template.id}
              data-testid={`story-grid-item-${template.id}`}
              role="listitem"
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
                title={sprintf(
                  /* translators: %s: saved template title.*/
                  __('Press Enter to explore details about %s', 'web-stories'),
                  template.title
                )}
              />
              <CardPreviewContainer
                ariaLabel={sprintf(
                  /* translators: %s: saved template title. */
                  __('preview of %s', 'web-stories'),
                  template.title
                )}
                tabIndex={tabIndex}
                pageSize={pageSize}
                story={template}
                centerAction={{
                  targetAction: (e) => actions.previewTemplate(e, template),
                  label: centerActionLabelByStatus[template.status],
                }}
                // this doesn't work yet and will throw an error in the editor, commenting out to prevent headaches while testing UI but leaving code in so that we know where things attach
                // bottomAction={{
                //   targetAction: bottomTargetAction(template),
                //   label: bottomActionLabel,
                // }}
              />
              <DetailRow>
                <CardTitle
                  tabIndex={tabIndex}
                  title={template.title}
                  titleLink={template.editStoryLink}
                  status={template?.status}
                  id={template.id}
                  secondaryTitle={template.author}
                  displayDate={
                    template?.status === STORY_STATUS.DRAFT
                      ? getRelativeDisplayDate(template?.modified)
                      : getRelativeDisplayDate(template?.created)
                  }
                />

                <StoryMenu
                  itemActive={isActive}
                  tabIndex={tabIndex}
                  onMoreButtonSelected={templateMenu.handleMenuToggle}
                  contextMenuId={templateMenu.contextMenuId}
                  onMenuItemSelected={templateMenu.handleMenuItemSelected}
                  story={template}
                  menuItems={generateStoryMenu({
                    menuItems: templateMenu.menuItems,
                    template,
                  })}
                />
              </DetailRow>
            </CardGridItem>
          );
        })}
      </StoryGrid>
    </div>
  );
};

SavedTemplateGridView.propTypes = {
  actions: TemplateActionsPropType,
  templates: TemplatesPropType,
  centerActionLabelByStatus: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.bool,
  ]),
  // bottomActionLabel: ActionLabel,
  pageSize: PageSizePropType.isRequired,
  templateMenu: StoryMenuPropType,
  initialFocusId: PropTypes.number,
};

export default SavedTemplateGridView;
