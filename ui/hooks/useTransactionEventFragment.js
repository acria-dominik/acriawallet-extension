import { useCallback } from 'react';

import { useGasFeeContext } from '../contexts/gasFee';
import {
  createTransactionEventFragment,
  updateEventFragment,
} from '../store/actions';

export const useTransactionEventFragment = () => {
  const { transaction } = useGasFeeContext();

  const updateTransactionEventFragment = useCallback(
    async (params) => {
      if (!transaction || !transaction.id) {
        return;
      }
      await createTransactionEventFragment(transaction.id);
      updateEventFragment(`transaction-added-${transaction.id}`, params);
    },
    [transaction],
  );

  return {
    updateTransactionEventFragment,
  };
};
