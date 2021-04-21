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
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf, TranslateWithMarkup } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Icons, Link, THEME_CONSTANTS } from '../../../../design-system';
import { useConfig } from '../../../app';
import { PRE_PUBLISH_MESSAGE_TYPES, types } from '../../../app/prepublish';
import { useHighlights } from '../../../app/highlights';
import { SimplePanel } from '../../panels/panel';
import { TEXT } from './constants';
import EmptyChecklist from './emptyChecklist';
import {
  DescriptionText,
  GoToIssue,
  IssueDescription,
  IssueTitle,
  NumberBadge,
  PageGroup,
  PageIndicator,
  PanelTitle,
  Row,
  StyledToggle,
  ToggleGroup,
  VideoOptimizationGroup,
} from './styles';

const ChecklistTab = ({
  areVideosAutoOptimized,
  checklist,
  onAutoVideoOptimizationClick,
}) => {
  const { dashboardSettingsLink, isRTL } = useConfig();
  const isVideoOptimizationEnabled = useFeature(
    'enablePrePublishVideoOptimization'
  );
  const areVideosInitiallyOptimized = useRef(areVideosAutoOptimized);

  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

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
          collapsedByDefault={false}
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
      {showRecommendedItems && (
        <SimplePanel
          name="checklist"
          hasBadge
          title={
            <>
              <PanelTitle isRecommended>{TEXT.RECOMMENDED_TITLE}</PanelTitle>
              <NumberBadge isRecommended number={recommendedLength} />
            </>
          }
          ariaLabel={TEXT.RECOMMENDED_TITLE}
        >
          {isVideoOptimizationEnabled && !areVideosInitiallyOptimized.current && (
            <VideoOptimizationGroup>
              <PageIndicator>{__('General', 'web-stories')}</PageIndicator>
              <DescriptionText>
                {__(
                  'Optimize all videos in the Story to ensure smooth playback.',
                  'web-stories'
                )}
              </DescriptionText>
              <ToggleGroup>
                <StyledToggle
                  id="automatic-video-optimization-toggle"
                  aria-label={__(
                    'Enable automatic video optimization',
                    'web-stories'
                  )}
                  checked={areVideosAutoOptimized}
                  onChange={onAutoVideoOptimizationClick}
                />
                <DescriptionText
                  forwardedAs="label"
                  htmlFor="automatic-video-optimization-toggle"
                >
                  <TranslateWithMarkup
                    mapping={{
                      a: (
                        <Link
                          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                          onClick={(evt) =>
                            trackClick(evt, 'click_video_optimization_settings')
                          }
                          href={dashboardSettingsLink}
                        />
                      ),
                    }}
                  >
                    {__(
                      'Enable automatic optimization. Change this any time in <a>Settings</a>.',
                      'web-stories'
                    )}
                  </TranslateWithMarkup>
                </DescriptionText>
              </ToggleGroup>
            </VideoOptimizationGroup>
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
  onAutoVideoOptimizationClick: PropTypes.func,
};

export default ChecklistTab;
