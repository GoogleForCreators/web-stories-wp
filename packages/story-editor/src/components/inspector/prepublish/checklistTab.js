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
import { useCallback, useMemo, Fragment } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@web-stories-wp/i18n';
import { Icons } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panels/panel';
import { PRE_PUBLISH_MESSAGE_TYPES, types } from '../../../app/prepublish';
import { Label } from '../../form';
import { useHighlights } from '../../../app/highlights';

const MAX_NUMBER_FOR_BADGE = 99;

const NumberBadge = styled.span`
  display: inline-flex;
  height: 20px;
  width: 20px;
  line-height: 20px;
  justify-content: center;
  margin-left: 14px;
  border-radius: 50%;
  font-size: ${({ number }) =>
    number > MAX_NUMBER_FOR_BADGE ? '10px' : '12px'};
  &::after {
    content: ${({ number }) => `"${annotateNumber(number)}"`};
  }
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.panel};
  background-color: ${({ theme, error }) =>
    error
      ? theme.DEPRECATED_THEME.colors.fg.negative
      : theme.DEPRECATED_THEME.colors.fg.warning};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  max-width: calc(100% - 10px);
`;

const PanelTitle = styled.span`
  color: ${({ theme, error }) =>
    error
      ? theme.DEPRECATED_THEME.colors.fg.negative
      : theme.DEPRECATED_THEME.colors.fg.warning};
`;

const Row = styled.button`
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  line-height: 24px;
  &:not(:first-child) {
    margin-top: 9px;
  }
  margin-bottom: 16px;
  margin-left: ${({ pageGroup }) => (pageGroup ? '16px' : '0')};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  width: calc(100% - 10px);
  max-width: 210px;
  &:focus {
    outline: 2px solid
      ${({ theme }) => theme.DEPRECATED_THEME.colors.accent.primary};
    outline-offset: 5px;
  }
`;

const Underline = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const HelperText = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.secondary};
`;

const PageIndicator = styled(Label)`
  &:not(:first-child) {
    padding-top: 9px;
  }
  margin-bottom: 8px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  svg {
    height: 14px;
    width: 9px;
    margin-right: 6px;
  }
`;

const EmptyLayout = styled.div`
  margin-top: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Checkmark = styled(Icons.Checkmark)`
  margin-bottom: 16px;
  height: 64px;
  width: 64px;
  padding: 8px 15px 5px 17px;
  border-radius: 50%;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.positive};
  border: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.positive};
  overflow: visible;
`;

const EmptyHeading = styled.h1`
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.secondary};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.lineHeight};
  margin: 0;
`;

const EmptyParagraph = styled.p`
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.secondary};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.description.size};
  line-height: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.description.lineHeight};
  margin: 0;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
`;

function annotateNumber(number) {
  if (number <= MAX_NUMBER_FOR_BADGE) {
    return number;
  }
  return `${MAX_NUMBER_FOR_BADGE}+`;
}

const ChecklistTab = (props) => {
  const { checklist } = props;

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
        onKeyDown: (event) => {
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
      const onPrepublish = getOnPrepublishSelect(args);
      const accessibleText = __('Select offending element', 'web-stories');
      return (
        <Row {...onPrepublish} tabIndex={0} key={id} pageGroup={pageGroup}>
          {onPrepublish.onClick ? (
            <Underline title={accessibleText}>{message}</Underline>
          ) : (
            message
          )}
          <HelperText>{help}</HelperText>
          {onPrepublish.onClick && (
            <VisuallyHidden>{accessibleText}</VisuallyHidden>
          )}
        </Row>
      );
    },
    [getOnPrepublishSelect]
  );

  const renderPageGroupedRow = useCallback(
    (entry) => {
      const [pageNum, messages] = entry;
      return (
        <Fragment key={`guidance-page-group-${pageNum}`}>
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
        </Fragment>
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
    return (
      <EmptyLayout>
        <Checkmark />
        <EmptyHeading>{__('Awesome work!', 'web-stories')}</EmptyHeading>
        <EmptyParagraph>{__('No Issues Found', 'web-stories')}</EmptyParagraph>
      </EmptyLayout>
    );
  }

  return (
    <>
      {showHighPriorityItems && (
        <SimplePanel
          collapsedByDefault={false}
          name="checklist"
          title={
            <TitleWrapper>
              <PanelTitle error>
                {__('High Priority', 'web-stories')}
              </PanelTitle>
              <NumberBadge error number={highPriorityLength} />
            </TitleWrapper>
          }
          ariaLabel={__('High Priority', 'web-stories')}
        >
          {highPriority.map(renderRow)}
          {Object.entries(pages.highPriority || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
      {showRecommendedItems && (
        <SimplePanel
          name="checklist"
          title={
            <TitleWrapper>
              <PanelTitle recommended>
                {__('Recommended', 'web-stories')}
              </PanelTitle>
              <NumberBadge recommended number={recommendedLength} />
            </TitleWrapper>
          }
          ariaLabel={__('Recommended', 'web-stories')}
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
};

export default ChecklistTab;
