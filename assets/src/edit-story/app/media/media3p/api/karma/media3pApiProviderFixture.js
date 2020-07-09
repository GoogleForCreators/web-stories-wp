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

/**
 * Internal dependencies
 */
import { useMemo } from 'react';
import Media3pApiContext from '../context';

/**
 * A fixture for mocking the API endpoint provider for media3p.
 *
 * Sample usage:
 * ```
 * beforeEach(async () => {
 *   fixture = new Fixture();
 *   media3pApiFixture = new Media3pApiProviderFixture();
 *
 *   fixture
 *     .stubComponent(Media3pApiProvider)
 *     .callFake(media3pApiFixture.Component);
 *   media3pApiFixture.listMedia.and.callFake(() => ( media });
 * }
 * ```
 */
export default class Media3pApiProviderFixture {
  constructor() {
    /* eslint-disable jasmine/no-unsafe-spy */
    const listMedia = jasmine.createSpy('listMedia');
    /* eslint-enable jasmine/no-unsafe-spy */
    this.listMedia = listMedia;

    const Component = ({ children }) => {
      const value = useMemo(
        () => ({
          actions: { listMedia },
        }),
        []
      );
      return (
        <Media3pApiContext.Provider value={value}>
          {children}
        </Media3pApiContext.Provider>
      );
    };
    Component.displayName = 'Fixture(Media3pApiProvider)';
    Component.propTypes = {
      children: PropTypes.node.isRequired,
    };

    this.Component = Component;
  }
}
