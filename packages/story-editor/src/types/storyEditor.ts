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

export type Flags = Record<string, boolean>;

export interface RESTError {
  message?: string;
  data?: {
    status: 400 | 401 | 403 | 500;
  };
}

export type User = {
  id: number;
  mediaOptimization: boolean;
  onboarding: Record<string, boolean>;
  trackingOptin: boolean;
};

export interface QuickAction {
  Icon: SVGElement;
  label: string;
  onClick: (evt: MouseEvent) => void;
  tooltipPlacement: string;
  onMouseDown: (evt: MouseEvent) => void;
}
