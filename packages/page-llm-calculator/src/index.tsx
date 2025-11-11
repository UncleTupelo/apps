// Copyright 2017-2021 @polkadot/app-llm-calculator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import Calculator from './Calculator';

function LLMCalculatorApp (props: Props): React.ReactElement<Props> {
  return <Calculator />;
}

export default React.memo(LLMCalculatorApp);
