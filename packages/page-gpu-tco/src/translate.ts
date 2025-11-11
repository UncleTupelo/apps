// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-gpu-tco', undefined> {
  return useTranslationBase('app-gpu-tco');
}

export default function translate (t: TFunction): TFunction {
  return t;
}
