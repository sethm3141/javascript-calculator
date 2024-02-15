import { createSlice } from '@reduxjs/toolkit';
import { NUMS, actions } from '../../assets/data/data';

const initialState = {
  preText: '',
  input: '0',
  output: null,
  isSymbol: true,
  isMinus: false,
  isFirstEntry: true,
  isDecimal: false,
};

const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    clearDisplay: (state) => {
      state.preText = '';
      state.input = '0';
      state.output = null;
      state.isSymbol = true;
      state.isMinus = false;
      state.isFirstEntry = true;
      state.isDecimal = false;
    },
    addToInput: (state, { payload: inputChar }) => {
      //* grab the old state that might change...
      let val = state.input;

      //* if input equals Infinity - 00
      if (state.input === 'Infinity') {
        clearDisplay();
        return;
      }

      //* after hitting equals, output=something, then reset if num is hit - 01
      if (state.output != null) {
        //* if a number is the input first
        if (NUMS.find((num) => num === inputChar)) {
          state.preText = '';
          state.input = inputChar;
          state.output = null;
          return;
        }

        //* if a decimal action or '0' is the input first
        if (inputChar === '.' || inputChar === '0') {
          if (inputChar === '.') {
            state.preText = '';
            state.input = '0.';
            state.output = null;
            state.isSymbol = true;
            state.isMinus = false;
            state.isFirstEntry = true;
            state.isDecimal = true;
            return;
          }
          state.preText = '';
          state.input = '0';
          state.output = null;
          state.isSymbol = true;
          state.isMinus = false;
          state.isFirstEntry = true;
          state.isDecimal = false;
          return;
        }
        if (actions.find((action) => action.value === inputChar)) {
          state.output = null;
        }
      }
      //! Continue here......................................
      //* decimal action is handled - 02
      if (inputChar === '.') {
        // console.log('tripped 02');
        if (state.isDecimal) {
          return;
        }
        if (val === '0' || val === '-0') {
          setState({ input: val + inputChar, isDecimal: true });
          return;
        }
        if (state.isSymbol) {
          setState({
            input: val + '0' + inputChar,
            isSymbol: false,
            isDecimal: true,
          });
          return;
        }
        setState({ input: val + inputChar, isDecimal: true });
        return;
      }

      //* first input is a minus - 03
      if (val === '0' && inputChar === '-') {
        // console.log('tripped 03');
        setState({ input: '-0' });
        return;
      }

      //* first input when not an action - 04
      if (
        (val === '0' || val === '-0') &&
        !actions.find((action) => action.value === inputChar)
      ) {
        // console.log('tripped 04');
        if (val === '-0') {
          setState({ input: '-' + inputChar, isSymbol: false });
          return;
        }
        setState({ input: inputChar, isSymbol: false });
        return;
      }

      //* no leading zeros on a number - 05
      if (inputChar === '0') {
        // console.log('tripped 05');
        if (state.isSymbol && !(val[val.length - 1] === '0')) {
          setState({ input: val + inputChar });
          return;
        } else if (state.isSymbol && val[val.length - 1] === '0') {
          return;
        }
      }

      //* if a +, x, /, or two - - get typed, limit input to just number next - 06
      if (
        actions.find((action) => action.value === inputChar) &&
        !(inputChar === '.')
      ) {
        // console.log('tripped 06');
        if (state.isSymbol && state.isMinus) {
          return;
        }
        if (state.isSymbol && inputChar === '-') {
          if (state.isFirstEntry) {
            setState({ input: val + inputChar, isFirstEntry: false });
            return;
          }
          setState({ input: val + inputChar, isMinus: true });
          return;
        }
        if (state.isSymbol && inputChar !== '-' && state.isFirstEntry) {
          return;
        }
        if (state.isSymbol && inputChar !== '-') {
          let newInputVal = '';
          for (let i = 0; i < val.length - 1; i++) {
            newInputVal = newInputVal + val[i];
          }
          setState({ input: newInputVal + inputChar });
          return;
        }
        setState({
          input: val + inputChar,
          isSymbol: true,
          isFirstEntry: false,
          isDecimal: false,
        });
        return;
      }

      //* basic setState if passes tests
      // console.log('tripped normal');
      setState({
        input: val + inputChar,
        isSymbol: false,
        isMinus: false,
      });
    },
    handleEquals: () => {},
  },
});

export const { clearDisplay, addToInput, handleEquals } = displaySlice.actions;

export default displaySlice.reducer;
