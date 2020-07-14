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
 * Internal dependencies
 */
import {
  parentRoute,
  resolveRoute,
  resolveRelatedTemplateRoute,
} from '../route';

describe('Route', function () {
  afterEach(() => {
    window.location.hash = '';
  });

  it('should return the parent route from the path.', function () {
    window.location.hash = '#/parent/child';
    expect(parentRoute()).toBe('#/parent');
  });

  it('should return the root hash if the hash only has one level.', function () {
    window.location.hash = 'parent';
    expect(parentRoute()).toBe('#/');
  });

  it('should the full URL if it has a http or https protocol.', function () {
    expect(resolveRoute('http://www.google.com')).toBe('http://www.google.com');
    expect(resolveRoute('https://www.google.com')).toBe(
      'https://www.google.com'
    );
  });

  it('should a hashed url if the route starts with a backslash', function () {
    expect(resolveRoute('/saved-templates')).toBe('#/saved-templates');
  });

  it('should append a nested route to the current hash when the path is relative', function () {
    window.location.hash = '#/templates-gallery';
    expect(resolveRoute('template-detail')).toBe(
      '#/templates-gallery/template-detail'
    );
  });

  it('should create a route hash when the path is a backslash', function () {
    expect(resolveRoute('/')).toBe('#/');
  });

  it('should create a route hash when the path is empty', function () {
    expect(resolveRoute('')).toBe('#/');
  });

  it('should create a route hash when the path is empty!', function () {
    window.location.hash = '#/saved-templates/template-detail?id=2';
    expect(
      resolveRelatedTemplateRoute({
        centerTargetAction: 'template-detail?id=1&local=false',
      })
    ).toBe('/saved-templates/template-detail?id=1&local=false');
  });
});
