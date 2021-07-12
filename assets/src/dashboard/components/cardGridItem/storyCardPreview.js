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
import { ActionLabel } from './types';

const CardWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Poster = styled.img`
  display: block;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.gradient.placeholder};
  object-fit: fill;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const EditControls = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;
  margin: 20px 0;
  transition: opacity ease-in-out 300ms;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  opacity: 0;

  ${({ theme }) => css`
    &[${ThemeGlobals.FOCUS_VISIBLE_DATA_ATTRIBUTE}] {
      ${themeHelpers.focusCSS(theme.colors.border.focus)};
    }
  `};
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
  bottomAction,
  storyImage,
  storyTitle,
}) => {
  return (
    <CardWrapper>
      <Poster
        src={storyImage}
        alt={storyTitle}
        as={!storyImage ? 'div' : 'img'}
      />
      {bottomAction?.label && (
        <EditControls className="card_buttons">
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
        </EditControls>
      )}
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
  bottomAction: ActionButtonPropType,
  topAction: ActionButtonPropType,
  tabIndex: PropTypes.number,
  storyImage: PropTypes.string,
  storyTitle: PropTypes.string,
};

export default StoryCardPreview;
