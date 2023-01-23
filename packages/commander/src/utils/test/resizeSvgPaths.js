/*
 * Copyright 2022 Google LLC
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
import resizeSvgPath from '../resizeSvgPath';

describe('resizeSvgPaths', () => {
  it('should resize paths', () => {
    const actual = resizeSvgPath(
      // viewbox width
      392,
      // viewbox height
      392,
      // path to normalize
      `M392,196c0,108.25-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0S392,87.75,392,196z M196,30
	c-44.34,0-86.03,17.27-117.38,48.62C47.27,109.97,30,151.66,30,196s17.27,86.03,48.62,117.38C109.97,344.73,151.66,362,196,362
	s86.03-17.27,117.38-48.62C344.73,282.03,362,240.34,362,196s-17.27-86.03-48.62-117.38C282.03,47.27,240.34,30,196,30 M196,0
	c108.25,0,196,87.75,196,196s-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0L196,0z`
    );

    expect(actual).toBe(
      '  M 1.000000 , 0.500000 c 0.000000 , 0.276148 -0.223852 , 0.500000 -0.500000 , 0.500000 S 0.000000 , 0.776148 , 0.000000 , 0.500000 S 0.223852 , 0.000000 , 0.500000 , 0.000000 S 1.000000 , 0.223852 , 1.000000 , 0.500000 z  M 0.500000 , 0.076531 c -0.113112 , 0.000000 -0.219464 , 0.044056 -0.299439 , 0.124031 C 0.120587 , 0.280536 , 0.076531 , 0.386888 , 0.076531 , 0.500000 s 0.044056 , 0.219464 , 0.124031 , 0.299439 C 0.280536 , 0.879413 , 0.386888 , 0.923469 , 0.500000 , 0.923469 s 0.219464 -0.044056 , 0.299439 -0.124031 C 0.879413 , 0.719464 , 0.923469 , 0.613112 , 0.923469 , 0.500000 s -0.044056 -0.219464 -0.124031 -0.299439 C 0.719464 , 0.120587 , 0.613112 , 0.076531 , 0.500000 , 0.076531 M 0.500000 , 0.000000 c 0.276148 , 0.000000 , 0.500000 , 0.223852 , 0.500000 , 0.500000 s -0.223852 , 0.500000 -0.500000 , 0.500000 S 0.000000 , 0.776148 , 0.000000 , 0.500000 S 0.223852 , 0.000000 , 0.500000 , 0.000000 L 0.500000 , 0.000000 z '
    );
  });
});
