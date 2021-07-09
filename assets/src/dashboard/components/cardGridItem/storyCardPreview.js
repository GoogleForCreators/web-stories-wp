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
import styled, { css } from 'styled-components';
import {
  themeHelpers,
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  ThemeGlobals,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { resolveRoute } from '../../app/router';
import { PageSizePropType } from '../../types';
import { ActionLabel } from './types';

// TODO: fallback for no image
const CardWrapper = styled.div`
  height: ${({ cardSize }) => `${cardSize.containerHeight}px`};
  width: ${({ cardSize }) => `${cardSize.width}px`};
  background-image: ${({ $bgImg }) => `url(${$bgImg})`};
  background-size: contain;
`;

const EditControls = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  transition: opacity ease-in-out 300ms;
  background: ${({ theme }) => theme.colors.interactiveBg.previewOverlay};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  opacity: 0;

  ${({ theme }) => css`
    &[${ThemeGlobals.FOCUS_VISIBLE_DATA_ATTRIBUTE}] {
      ${themeHelpers.focusCSS(theme.colors.border.focus)};
    }
  `};
`;

const ActionContainer = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const EmptyActionContainer = styled(ActionContainer)`
  padding: 40px;
`;

const getActionAttributes = (targetAction) =>
  typeof targetAction === 'string'
    ? {
        href: resolveRoute(targetAction),
        isLink: true,
        as: 'a',
      }
    : { onClick: targetAction };

const StoryCardPreview = ({
  tabIndex,
  centerAction,
  bottomAction,
  topAction,
  pageSize,
  storyImage,
}) => {
  return (
    <CardWrapper $bgImg={storyImage} cardSize={pageSize}>
      <EditControls
        className="card_buttons"
        data-testid="card-action-container"
      >
        {!topAction && <EmptyActionContainer />}
        {topAction?.label && (
          <ActionContainer>
            <Button
              tabIndex={tabIndex}
              data-testid="card-top-action"
              type={BUTTON_TYPES.SECONDARY}
              {...getActionAttributes(topAction.targetAction)}
              aria-label={topAction.ariaLabel}
            >
              {topAction.label}
            </Button>
          </ActionContainer>
        )}

        {centerAction?.label && (
          <ActionContainer>
            <Button
              tabIndex={tabIndex}
              data-testid="card-center-action"
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              {...getActionAttributes(centerAction.targetAction)}
              aria-label={centerAction.ariaLabel}
            >
              {centerAction.label}
            </Button>
          </ActionContainer>
        )}
        {bottomAction?.label ? (
          <ActionContainer>
            <Button
              {...getActionAttributes(bottomAction.targetAction)}
              tabIndex={tabIndex}
              aria-label={bottomAction.ariaLabel}
              isDisabled={!bottomAction.targetAction}
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.SMALL}
            >
              {bottomAction.label}
            </Button>
          </ActionContainer>
        ) : (
          <EmptyActionContainer />
        )}
      </EditControls>
    </CardWrapper>
  );
};

const ActionButtonPropType = PropTypes.shape({
  targetAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    .isRequired,
  label: ActionLabel,
  ariaLabel: PropTypes.string,
});

StoryCardPreview.propTypes = {
  centerAction: ActionButtonPropType,
  bottomAction: ActionButtonPropType,
  topAction: ActionButtonPropType,
  pageSize: PageSizePropType.isRequired,
  tabIndex: PropTypes.number,
  storyImage: PropTypes.string,
};

export default StoryCardPreview;
