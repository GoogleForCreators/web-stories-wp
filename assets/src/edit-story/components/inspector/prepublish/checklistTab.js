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
import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Icons } from '../../../../design-system';
import { useConfig } from '../../../app';
import { PRE_PUBLISH_MESSAGE_TYPES, types } from '../../../app/prepublish';
import { useHighlights } from '../../../app/highlights';
import { SimplePanel } from '../../panels/panel';
import {
  DISABLED_HIGH_PRIORITY_CHECKPOINTS,
  DISABLED_RECOMMENDED_CHECKPOINTS,
  TEXT,
} from './constants';
import EmptyChecklist from './emptyChecklist';
import {
  GoToIssue,
  IssueDescription,
  IssueTitle,
  NumberBadge,
  PageIndicator,
  PageGroup,
  PanelTitle,
  Row,
} from './styles';
import { PPC_CHECKPOINT_STATE } from './prepublishCheckpointState';

const ChecklistTab = ({ checklist, currentCheckpoint }) => {
  const { isRTL } = useConfig();
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const { isHighPriorityDisabled, isRecommendedDisabled } = useMemo(
    () => ({
      isRecommendedDisabled:
        DISABLED_RECOMMENDED_CHECKPOINTS.indexOf(currentCheckpoint) > -1,
      isHighPriorityDisabled:
        DISABLED_HIGH_PRIORITY_CHECKPOINTS.indexOf(currentCheckpoint) > -1,
    }),
    [currentCheckpoint]
  );

  const { highPriority, recommended, pages } = useMemo(
    () =>
      checklist.reduce(
        (prevMessages, current) => {
          const id = uuidv4();
          const currentMessage = { ...current, id };
          const isHighPriority =
            currentMessage.type === PRE_PUBLISH_MESSAGE_TYPES.ERROR;

          const [typeKey, copyKey] = isHighPriority
            ? ['highPriority', 'recommended']
            : ['recommended', 'highPriority'];

          if (currentMessage.page !== undefined) {
            const prevTypeGroup = prevMessages.pages[typeKey] || {};
            const prevPageGroup = prevTypeGroup[currentMessage.page] || [];

            let prevLengths = { highPriority: 0, recommended: 0 };
            if (prevMessages.pages?.lengths) {
              ({ lengths: prevLengths } = prevMessages.pages);
            }

            return {
              recommended: prevMessages.recommended,
              highPriority: prevMessages.highPriority,
              pages: {
                ...prevMessages.pages,
                [typeKey]: {
                  ...prevTypeGroup,
                  [currentMessage.page]: [...prevPageGroup, currentMessage],
                },
                lengths: {
                  ...prevLengths,
                  [typeKey]: prevLengths[typeKey] + 1,
                },
              },
            };
          }

          const groupedMessages = {
            [copyKey]: prevMessages[copyKey],
            [typeKey]: [...prevMessages[typeKey], currentMessage],
          };
          return { pages: prevMessages.pages, ...groupedMessages };
        },
        {
          highPriority: [],
          recommended: [],
          pages: {},
        }
      ),
    [checklist]
  );

  const getOnPrepublishSelect = useCallback(
    (args) => {
      const { elements, elementId, pageId, highlight } = args;
      if (!elements && !elementId && !pageId && !highlight) {
        return {};
      }

      return {
        onClick: () => setHighlights(args),
        onKeyUp: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            setHighlights(args);
          }
        },
      };
    },
    [setHighlights]
  );

  const renderRow = useCallback(
    (args) => {
      const { id, message, help, pageGroup } = args;
      const prepublishProps = getOnPrepublishSelect(args);
      const isClickable = Boolean(prepublishProps?.onClick);
      return (
        <Row key={id} pageGroup={pageGroup}>
          <IssueTitle
            {...prepublishProps}
            tabIndex={0}
            $isClickable={isClickable}
          >
            {message}
            {isClickable && (
              <GoToIssue aria-label={TEXT.ACCESSIBLE_LINK_TITLE}>
                {isRTL ? <Icons.ArrowLeft /> : <Icons.ArrowRight />}
              </GoToIssue>
            )}
          </IssueTitle>
          {help && <IssueDescription>{help}</IssueDescription>}
        </Row>
      );
    },
    [getOnPrepublishSelect, isRTL]
  );

  const renderPageGroupedRow = useCallback(
    (entry) => {
      const [pageNum, messages] = entry;
      return (
        <PageGroup key={`guidance-page-group-${pageNum}`}>
          <PageIndicator>
            {sprintf(
              /* translators: %s: page number. */
              __('Page %s', 'web-stories'),
              pageNum
            )}
          </PageIndicator>
          {messages.map((message) =>
            renderRow({ ...message, pageGroup: true })
          )}
        </PageGroup>
      );
    },
    [renderRow]
  );

  const highPriorityLength =
    highPriority.length + (pages.lengths?.highPriority || 0);
  const recommendedLength =
    recommended.length + (pages.lengths?.recommended || 0);

  const showHighPriorityItems = Boolean(highPriorityLength);
  const showRecommendedItems =
    Boolean(recommended.length) || Boolean(pages.lengths?.recommended);

  if (!showHighPriorityItems && !showRecommendedItems) {
    return <EmptyChecklist />;
  }

  return (
    <>
      {showHighPriorityItems && (
        <SimplePanel
          collapsedByDefault={isHighPriorityDisabled}
          isToggleDisabled={isHighPriorityDisabled}
          name="checklist"
          hasBadge
          title={
            <>
              <PanelTitle isDisabled={isHighPriorityDisabled}>
                {TEXT.HIGH_PRIORITY_TITLE}
              </PanelTitle>
              {!isHighPriorityDisabled && (
                <NumberBadge number={highPriorityLength} />
              )}
            </>
          }
          ariaLabel={TEXT.HIGH_PRIORITY_TITLE}
        >
          {highPriority.map(renderRow)}
          {Object.entries(pages.highPriority || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
      {showRecommendedItems && (
        <SimplePanel
          isToggleDisabled={isRecommendedDisabled}
          name="checklist"
          hasBadge
          title={
            <>
              <PanelTitle isRecommended isDisabled={isRecommendedDisabled}>
                {TEXT.RECOMMENDED_TITLE}
              </PanelTitle>
              {!isRecommendedDisabled && (
                <NumberBadge isRecommended number={recommendedLength} />
              )}
            </>
          }
          ariaLabel={TEXT.RECOMMENDED_TITLE}
        >
          {recommended.map(renderRow)}
          {Object.entries(pages.recommended || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
    </>
  );
};

ChecklistTab.propTypes = {
  checklist: types.GuidanceChecklist,
  currentCheckpoint: PropTypes.oneOf(Object.values(PPC_CHECKPOINT_STATE)),
};

export default ChecklistTab;
