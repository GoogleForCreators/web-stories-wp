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
export type TransformHandler = (frame: Transform | null) => void;
export type HandlerRegister = (
  id: string,
  handler: TransformHandler
) => () => void;

export type HandlersList = Record<string, TransformHandler[]>;

export type TransformsList = Record<string, Record<string, unknown> | null>;

export interface Transform {
  staticTransformation: boolean;
  color?: unknown;
  style?: string;
  resize?: [number, number];
  dropTargets?: { hover: boolean; active: boolean };
  updates?: Record<string, unknown>;
}

export type PushTransform = (id: string, transform: Transform | null) => void;
export type ClearTransform = () => void;

export interface State {
  actions: {
    registerTransformHandler?: HandlerRegister;
    pushTransform?: PushTransform;
    clearTransforms?: ClearTransform;
  };
  state: {
    isAnythingTransforming?: boolean;
  };
}
