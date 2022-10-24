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

import 'styled-components';

interface Font {
  family: string;
  size: string;
  lineHeight: string;
  fontWeight: number;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      bg: {
        [key: string]: string;
      };
      primary: string;
      secondary: string;
      tertiary: string;
      link: {
        fg: string;
        hover: {
          [key: string]: string;
        };
      };
      action: {
        bg: string;
        fg: string;
        hover: {
          [key: string]: string;
        };
      };
    };
    fonts: {
      [key: string]: Font;
    };
    breakpoint: {
      [key: string]: string;
    };
  }
}
