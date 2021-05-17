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
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@web-stories-wp/i18n';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import { Icons } from '../../../../../design-system';
import { useConfig } from '../../../../app';
import {
  PRE_PUBLISH_MESSAGE_TYPES,
  MESSAGES,
  types,
} from '../../../../app/prepublish';
import { useHighlights } from '../../../../app/highlights';
import { SimplePanel } from '../../../panels/panel';
import {
  DISABLED_HIGH_PRIORITY_CHECKPOINTS,
  DISABLED_RECOMMENDED_CHECKPOINTS,
  TEXT,
} from '../constants';
import { PPC_CHECKPOINT_STATE } from '../prepublishCheckpointState';
import AutoVideoOptimization from './autoVideoOptimization';
import EmptyChecklist from './emptyChecklist';
import {
  GoToIssue,
  IssueDescription,
  IssueTitle,
  NumberBadge,
  PageGroup,
  PageIndicator,
  PanelTitle,
  Row,
} from './styles';

const ChecklistTab = ({
  areVideosAutoOptimized,
  checklist,
  currentCheckpoint,
  onAutoVideoOptimizationClick,
  isChecklistEmpty,
}) => {
  const {
    isRTL,
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { enablePrePublishVideoOptimization } = useFeatures();
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const canOptimizeVideo =
    hasUploadMediaAction && enablePrePublishVideoOptimization;

  const { isHighPriorityDisabledState, isRecommendedDisabledState } = useMemo(
    () => ({
      isRecommendedDisabledState:
        DISABLED_RECOMMENDED_CHECKPOINTS.indexOf(currentCheckpoint) > -1,
      isHighPriorityDisabledState:
        DISABLED_HIGH_PRIORITY_CHECKPOINTS.indexOf(currentCheckpoint) > -1,
    }),
    [currentCheckpoint]
  );

  const { highPriority, recommended, pages } = useMemo(
    () =>
      checklist
        // TODO remove filtering out video optimization check
        // based on feature flag after design has a chance to
        // look at it.
        .filter((item) =>
          item.message === MESSAGES.MEDIA.VIDEO_NOT_OPTIMIZED.MAIN_TEXT
            ? canOptimizeVideo
            : true
        )
        .reduce(
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
    [checklist, canOptimizeVideo]
  );

  const getOnPrepublishSelect = useCallback(
    (args) => {
      const { elements, elementId, pageId, highlight, noHighlight } = args;
      if (noHighlight || (!elements && !elementId && !pageId && !highlight)) {
        return {};
      }

      return {
        onClick: () => setHighlights(args),
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
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

  // Determine what to make visible based on checkpoint and present issues.
  const highPriorityLength =
    highPriority.length + (pages.lengths?.highPriority || 0);
  const hasHighPriorityItems = Boolean(highPriorityLength);
  const isHighPriorityVisible =
    !isHighPriorityDisabledState && hasHighPriorityItems;

  const recommendedLength =
    recommended.length + (pages.lengths?.recommended || 0);
  const hasRecommendedItems =
    Boolean(recommended.length) ||
    Boolean(pages.lengths?.recommended) ||
    (canOptimizeVideo && !areVideosAutoOptimized);
  const isRecommendedVisible =
    !isRecommendedDisabledState && hasRecommendedItems;

  const isEmptyView = useMemo(() => {
    return (
      currentCheckpoint === PPC_CHECKPOINT_STATE.UNAVAILABLE ||
      isChecklistEmpty ||
      (!isRecommendedVisible && !isHighPriorityVisible)
    );
  }, [
    currentCheckpoint,
    isRecommendedVisible,
    isHighPriorityVisible,
    isChecklistEmpty,
  ]);

  if (isEmptyView) {
    return (
      <EmptyChecklist
        body={
          currentCheckpoint === PPC_CHECKPOINT_STATE.NO_ISSUES
            ? TEXT.EMPTY_BODY
            : TEXT.UNAVAILABLE_BODY
        }
      />
    );
  }

  return (
    <>
      {isHighPriorityVisible && (
        <SimplePanel
          name="checklist"
          hasBadge
          title={
            <>
              <PanelTitle>{TEXT.HIGH_PRIORITY_TITLE}</PanelTitle>
              <NumberBadge number={highPriorityLength} />
            </>
          }
          ariaLabel={TEXT.HIGH_PRIORITY_TITLE}
        >
          {highPriority.map(renderRow)}
          {Object.entries(pages.highPriority || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
      {isRecommendedVisible && (
        <SimplePanel
          name="checklist"
          hasBadge
          title={
            <>
              <PanelTitle isRecommended>{TEXT.RECOMMENDED_TITLE}</PanelTitle>
              {recommendedLength > 0 && (
                <NumberBadge isRecommended number={recommendedLength} />
              )}
            </>
          }
          ariaLabel={TEXT.RECOMMENDED_TITLE}
        >
          {canOptimizeVideo && (
            <AutoVideoOptimization
              areVideosAutoOptimized={areVideosAutoOptimized}
              onAutoOptimizeVideoClick={onAutoVideoOptimizationClick}
            />
          )}
          {recommended.map(renderRow)}
          {Object.entries(pages.recommended || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
    </>
  );
};

ChecklistTab.propTypes = {
  areVideosAutoOptimized: PropTypes.bool,
  checklist: types.GuidanceChecklist,
  currentCheckpoint: PropTypes.oneOf(Object.values(PPC_CHECKPOINT_STATE)),
  onAutoVideoOptimizationClick: PropTypes.func,
  isChecklistEmpty: PropTypes.bool,
};

export default ChecklistTab;
