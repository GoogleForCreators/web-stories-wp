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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { noop } from '../../../utils/noop';
import { GUTTER_WIDTH } from '../constants';
import { Header } from './header';
import { Tips } from './tips';
import { Transitioner } from './transitioner';

const Container = styled.div`
  padding: 0 ${GUTTER_WIDTH}px;
  max-height: 60vh;
  overflow-y: scroll;

  * {
    user-select: text;
  }
`;

export function Menu({
  onTipSelect = noop,
  readTips,
  components,
  ...transitionProps
}) {
  const Footer = components?.Footer;
  return (
    <Transitioner {...transitionProps}>
      <Container data-testid="help_center_container">
        <Header />
        <Tips readTips={readTips} onTipSelect={onTipSelect} />
        {Footer && <Footer />}
      </Container>
    </Transitioner>
  );
}
Menu.propTypes = {
  readTips: PropTypes.object,
  onTipSelect: PropTypes.func.isRequired,
  components: PropTypes.shape({
    Footer: PropTypes.elementType,
  }),
};
