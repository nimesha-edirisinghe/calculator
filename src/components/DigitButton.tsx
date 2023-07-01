import React from 'react';
import { Action } from '../App';

interface DigitButtonProps {
  dispatch: React.Dispatch<Action>;
  digit: string;
}

const DigitButton: React.FC<DigitButtonProps> = ({ dispatch, digit }) => {
  return (
    <button onClick={() => dispatch({ type: 'add-digit', payload: { digit } })}>
      {digit}
    </button>
  );
};

export default DigitButton;
