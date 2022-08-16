/*
 * Copyright 2021 Google LLC
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
import { Icons, LoadingBar } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import {
  THUMBNAIL_TYPES,
  THUMBNAIL_SCRIM_CLASSNAME,
  DEFAULT_LOADING_MESSAGE,
  THUMBNAIL_SHOW_ON_HOVER_FOCUS,
} from './constants';
import { Container, Background, NestedIconContainer, Scrim } from './styles';

const includeDefaultScrimBackground = [
  THUMBNAIL_TYPES.SHAPE,
  THUMBNAIL_TYPES.TEXT,
];

/**
 * Element and page thumbnails, used in the prepublish checklist
 *
 * @param {Object} props Component props.
 * @param {Node} props.displayBackground Node that renders the element. Relies on PagePreview or LayerIcon (getDefinitionForType, see panels/layer) to keep element rendering consistent with carousel and layer panels. See /storybook for demo.
 * @param {boolean} props.isError Thumbnail errors don't prevent further interaction with the thumbnail, they just change the presentation so user knows the action failed.
 * @param {boolean} props.isLoading If a thumbnail needs to show a loading progress bar this should be true.
 * @param {string} props.loadingMessage If a thumbnail needs an aria alert with loading bar this should be used.
 * @param {Function} props.onClick If a thumbnail has an action, it's called on onClick. Responsible for making sure the thumbnail is rendered as a button instead of a div.
 * @param {string} props.type One of the values of THUMBNAIL_TYPES. Responsible for specific context renderings based on thumbnail type.
 * @param {Node} props.children Content rendered within a thumbnail, according to designs, are icons with tooltips.
 * @return {Node} Thumbnail to render
 */
const Thumbnail = ({
  displayBackground,
  isError,
  onClick,
  type,
  isLoading,
  loadingMessage = DEFAULT_LOADING_MESSAGE,
  children,
  ...rest
}) => (
  <Container
    as={!onClick ? 'div' : 'button'}
    onClick={onClick}
    $isError={isError}
    {...rest}
  >
    {isLoading && <LoadingBar loadingMessage={loadingMessage} />}
    {!isError && !isLoading && children && (
      <NestedIconContainer className={THUMBNAIL_SHOW_ON_HOVER_FOCUS}>
        {children}
      </NestedIconContainer>
    )}
    {isError && (
      <NestedIconContainer $isError={isError}>
        <Icons.ExclamationOutline />
      </NestedIconContainer>
    )}
    <Scrim
      $showDefaultBackground={includeDefaultScrimBackground.indexOf(type) > -1}
      className={THUMBNAIL_SCRIM_CLASSNAME}
    />
    <Background
      $isShape={type === THUMBNAIL_TYPES.SHAPE}
      $isPage={type === THUMBNAIL_TYPES.PAGE}
    >
      {displayBackground}
    </Background>
  </Container>
);

Thumbnail.propTypes = {
  displayBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  type: PropTypes.oneOf(Object.values(THUMBNAIL_TYPES)).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  onClick: PropTypes.func,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
};
export default Thumbnail;
