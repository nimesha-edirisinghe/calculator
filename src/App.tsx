import { useReducer } from 'react';
import './styles.css';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';

type State = {
  currentOperand: string | undefined | null;
  previousOperand: string | undefined | null;
  operation: string | undefined | null;
  overwrite: boolean;
};

export type ActionTypes = {
  ADD_DIGIT: 'add-digit';
  CHOOSE_OPERATION: 'choose-operation';
  CLEAR: 'clear';
  DELETE_DIGIT: 'delete-digit';
  EVALUATE: 'evaluate';
};

export type Action =
  | { type: 'add-digit'; payload?: { digit?: string; operation?: string } }
  | {
      type: 'choose-operation';
      payload?: { digit?: string; operation?: string };
    }
  | { type: 'clear'; payload?: { digit?: string; operation?: string } }
  | { type: 'delete-digit'; payload?: { digit?: string; operation?: string } }
  | { type: 'evaluate'; payload?: { digit?: string; operation?: string } };

const initialState: State = {
  currentOperand: null,
  previousOperand: null,
  operation: null,
  overwrite: false,
};

function evaluate({ currentOperand, previousOperand, operation }: any) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return null;
  let computation: any = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '/':
      computation = prev / current;
      break;
  }

  return computation.toString();
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add-digit':
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload?.digit,
          overwrite: false,
        };
      }
      if (action.payload?.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (
        action.payload?.digit === '.' &&
        state.currentOperand?.includes('.')
      ) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${action.payload?.digit}`,
      };
    case 'choose-operation':
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload?.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: action.payload?.operation,
          currentOperand: null,
        };
      } else {
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: action.payload?.operation,
          currentOperand: null,
        };
      }
    case 'evaluate':
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state),
      };
    case 'clear':
      return {
        currentOperand: '',
        previousOperand: '',
        operation: '',
        overwrite: false,
      };
    case 'delete-digit':
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    default:
      throw new Error('Unsupported action type');
  }
};

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});
function formatOperand(operand: any) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(state.previousOperand)} {state.operation}
        </div>
        <div className="current-operand">
          {formatOperand(state.currentOperand)}
        </div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: 'clear' })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: 'delete-digit' })}>DEL</button>
      <OperationButton operation={'/'} dispatch={dispatch} />
      <DigitButton digit={'1'} dispatch={dispatch} />
      <DigitButton digit={'2'} dispatch={dispatch} />
      <DigitButton digit={'3'} dispatch={dispatch} />
      <OperationButton operation={'*'} dispatch={dispatch} />
      <DigitButton digit={'4'} dispatch={dispatch} />
      <DigitButton digit={'5'} dispatch={dispatch} />
      <DigitButton digit={'6'} dispatch={dispatch} />
      <OperationButton operation={'+'} dispatch={dispatch} />
      <DigitButton digit={'7'} dispatch={dispatch} />
      <DigitButton digit={'8'} dispatch={dispatch} />
      <DigitButton digit={'9'} dispatch={dispatch} />
      <OperationButton operation={'-'} dispatch={dispatch} />
      <DigitButton digit={'.'} dispatch={dispatch} />
      <DigitButton digit={'0'} dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: 'evaluate' })}
      >
        =
      </button>
    </div>
  );
}

export default App;
