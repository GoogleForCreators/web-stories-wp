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
/**
 * Internal dependencies
 */
import { noop, Icons } from '../../../design-system';
import { THUMBNAIL_TYPES, THUMBNAIL_SCRIM_CLASSNAME } from './constants';
import { Container, Background, NestedIconContainer, Scrim } from './styles';

const includeDefaultScrimBackground = [
  THUMBNAIL_TYPES.SHAPE,
  THUMBNAIL_TYPES.TEXT,
];

/**
 * Element and page thumbnails, used in the prepublish checklist
 *
 * @param {Node} displayBackground Node that renders the element. Relies on PagePreview or LayerIcon (getDefinitionForType, see panels/design/layer) to keep element rendering consistent with carousel and layer panels. See /storybook for demo.
 * @param {boolean} isError Thumbnail errors don't prevent further interaction with the thumbnail, they just change the presentation so user knows the action failed.
 * @param {Function} handleClick If a thumbnail has an action, it's called on handleClick. Responsible for making sure the thumbnail is rendered as a button instead of a div.
 * @param {string} type One of the values of THUMBNAIL_TYPES. Responsible for specific context renderings based on thumbnail type.
 * @param {Node} children Content rendered within a thumbnail, according to designs, are icons with tooltips.
 * @return {Node} Thumbnail to render
 */
const Thumbnail = ({
  displayBackground,
  isError,
  handleClick,
  type,
  children,
  ...rest
}) => (
  <Container
    as={!handleClick ? 'div' : 'button'}
    onClick={handleClick || noop}
    $isError={isError}
    {...rest}
  >
    {!isError && children && (
      <NestedIconContainer>{children}</NestedIconContainer>
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
  ]).isRequired,
  type: PropTypes.oneOf(Object.values(THUMBNAIL_TYPES)).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  handleClick: PropTypes.func,
  isError: PropTypes.bool,
};
export default Thumbnail;
