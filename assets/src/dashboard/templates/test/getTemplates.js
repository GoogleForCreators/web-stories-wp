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
import { getImageFile } from '../getTemplates';

describe('getImageFile', () => {
  it('pulls the file name off the url', () => {
    const file = 'sample_image.jpg';
    const url = `http://localhost:8899/wp-content/uploads/2020/05/${file}`;

    expect(getImageFile(url)).toStrictEqual(file);
  });

  it('works with (.jpg | .jpeg | .gif | .png | .svg) extensions', () => {
    ['jpg', 'jpeg', 'gif', 'png', 'svg'].forEach((extension) => {
      const file = `some_image.${extension}`;
      const url = `http://localhost:8899/wp-content/uploads/2020/05/${file}`;
      expect(getImageFile(url)).toStrictEqual(file);
    });
  });

  /**
   * Wordpress adds a `-x` suffix to images with the same
   * name uploaded multiple times. We want to remove this
   * suffix so the right images are pointed to in our repo.
   *
   * More information about this can be found in templates/README
   */
  it('removes the -x suffix from file names', () => {
    [
      ['some_file-2.jpg', 'some_file.jpg'],
      ['some_file-21.jpg', 'some_file.jpg'],
      ['12-some3fas_file-21a.jpg', '12-some3fas_file-21a.jpg'],
      ['12-some3fas_file-21a-1.jpg', '12-some3fas_file-21a.jpg'],
      ['12-34-46-78-9.jpg', '12-34-46-78.jpg'],
    ].forEach((file) => {
      expect(getImageFile(file[0])).toStrictEqual(file[1]);
    });
  });
});
