import React from 'react';
import { Action } from '../App';

interface OperationButtonProps {
  dispatch: React.Dispatch<Action>;
  operation: string;
}

const OperationButton: React.FC<OperationButtonProps> = ({
  dispatch,
  operation,
}) => {
  return (
    <button
      onClick={() =>
        dispatch({ type: 'choose-operation', payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};

export default OperationButton;
