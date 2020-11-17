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
import { useCallback, useMemo, Fragment } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panels/panel';
import { Rectangle } from '../../../icons';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../app/prepublish/constants';
import { GuidanceChecklist } from '../../../app/prepublish/types';
import { Label } from '../../form';

const NumberDecorator = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  font-size: ${({ theme }) => theme.fonts.body1.size};
  margin-right: 7px;
  border-radius: 100%;
  color: ${({ theme }) => theme.colors.bg.panel};
  background-color: ${({ theme, error }) =>
    error ? theme.colors.fg.negative : theme.colors.fg.warning};
`;

const PanelTitle = styled.span`
  color: ${({ theme, error }) =>
    error ? theme.colors.fg.negative : theme.colors.fg.warning};
`;

const Row = styled.div`
  margin-bottom: 25px;
  padding-left: 12px;
`;

const PageIndicator = styled(Label)`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  svg {
    height: 14px;
    width: 14px;
    margin-right: 6px;
  }
`;

const ChecklistTab = (props) => {
  const { checklist } = props;

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

  const renderRow = useCallback(({ message, id }) => {
    return <Row key={`guidance-${id}`}>{message}</Row>;
  }, []);

  const renderPageGroupedRow = (entry) => {
    const [pageNum, messages] = entry;
    return (
      <Fragment key={`guidance-page-group-${pageNum}`}>
        <PageIndicator>
          <Rectangle />
          {sprintf(
            /* translators: %s: the page number where the checklist issue is. */
            __('Page %s', 'web-stories'),
            pageNum
          )}
        </PageIndicator>
        {messages.map(renderRow)}
      </Fragment>
    );
  };

  const showHighPriorityItems =
    Boolean(highPriority.length) || Boolean(pages.lengths?.highPriority);
  const showRecommendedItems =
    Boolean(recommended.length) || Boolean(pages.lengths?.recommended);

  return (
    <>
      {showHighPriorityItems && (
        <SimplePanel
          name="checklist"
          title={
            <>
              <NumberDecorator error>{highPriority.length}</NumberDecorator>
              <PanelTitle error>
                {__('High Priority', 'web-stories')}
              </PanelTitle>
            </>
          }
        >
          {highPriority.map(renderRow)}
          {Object.entries(pages.highPriority || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
      {showRecommendedItems && (
        <SimplePanel
          name="checklist"
          title={
            <>
              <NumberDecorator recommended>
                {recommended.length}
              </NumberDecorator>
              <PanelTitle recommended>
                {__('Recommended', 'web-stories')}
              </PanelTitle>
            </>
          }
        >
          {recommended.map(renderRow)}
          {Object.entries(pages.recommended || {}).map(renderPageGroupedRow)}
        </SimplePanel>
      )}
    </>
  );
};

ChecklistTab.propTypes = {
  checklist: GuidanceChecklist,
};

export default ChecklistTab;
