import { createSlice } from '@reduxjs/toolkit';
import { NUMS, OPERATIONS, actions } from '../../assets/data/data';

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

      //* decimal action is handled - 02
      if (inputChar === '.') {
        if (state.isDecimal) {
          return;
        }
        if (val === '0' || val === '-0') {
          state.input = val + inputChar;
          state.isDecimal = true;
          return;
        }
        if (state.isSymbol) {
          state.input = val + '0' + inputChar;
          state.isSymbol = false;
          state.isDecimal = true;
          return;
        }
        state.input = val + inputChar;
        state.isDecimal = true;
        return;
      }

      //* first input is a minus - 03
      if (val === '0' && inputChar === '-') {
        state.input = '-0';
        return;
      }

      //* first input when not an action - 04
      if (
        (val === '0' || val === '-0') &&
        !actions.find((action) => action.value === inputChar)
      ) {
        if (val === '-0') {
          state.input = '-' + inputChar;
          state.isSymbol = false;
          return;
        }
        state.input = inputChar;
        state.isSymbol = false;
        return;
      }

      //* no leading zeros on a number - 05
      if (inputChar === '0') {
        if (state.isSymbol && !(val[val.length - 1] === '0')) {
          state.input = val + inputChar;
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
        if (state.isSymbol && state.isMinus) {
          return;
        }
        if (state.isSymbol && inputChar === '-') {
          if (state.isFirstEntry) {
            state.input = val + inputChar;
            state.isFirstEntry = false;
            return;
          }
          state.input = val + inputChar;
          state.isMinus = true;
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
          state.input = newInputVal + inputChar;
          return;
        }
        state.input = val + inputChar;
        state.isSymbol = true;
        state.isFirstEntry = false;
        state.isDecimal = false;
        return;
      }

      //* basic setState if passes tests
      state.input = val + inputChar;
      state.isSymbol = false;
      state.isMinus = false;
    },
    handleEquals: (state) => {
      // If scientific notation is incoming, then switch to zero
      let str = ''; // input string to be processed
      if (state.input.search('e') + 1) {
        str = '0';
      } else {
        str = state.input;
      }
      let strHold = '';
      let calc = 0; // output final calculated value
      let numbers_str = []; // array of processed numbers/strings
      let numbers_dec = []; // array of processed numbers/decimal type
      let calcs = []; // array of operations that need to be ran

      //* remove -- with +
      while (str.indexOf('--') + 1) {
        str = str.replace('--', '+');
      }

      //* remove any hanging actions at the end
      let indexEnd = 0;
      for (let i = str.length - 1; i >= 0; i--) {
        if (OPERATIONS.find((operation) => operation === str[i])) {
          indexEnd--;
        } else {
          break;
        }
      }
      if (indexEnd !== 0) {
        str = str.slice(0, indexEnd);
      }

      //* remove any hanging '.' decimal points
      let tempStr = [];
      for (let i = 0; i < str.length; i++) {
        if (str[i] === '.' && !NUMS.find((num) => num === str[i + 1])) {
          continue;
        }
        tempStr.push(str[i]);
      }
      str = tempStr;

      //* group numbers with and without - sign inside of () and place + if there's only single -
      strHold = '';
      if (str[0] === '-') {
        strHold = '(-';
      } else {
        strHold = '(' + str[0];
      }
      for (let i = 1; i < str.length; i++) {
        if (
          str[i] !== '.' &&
          str[i] !== '-' &&
          OPERATIONS.find((operation) => operation === str[i])
        ) {
          strHold = strHold + ')' + str[i] + '(';
          continue;
        }
        if (str[i] === '-' && NUMS.find((num) => num === str[i - 1])) {
          strHold = strHold + ')+(';
        }

        strHold = strHold + str[i];
      }
      strHold += ')';
      str = strHold;

      //* grab every number inside the ()'s into the array of numbers
      //* grab every operation outside the ()'s into the array of calcs
      strHold = '';
      for (let i = 1; i < str.length - 1; i++) {
        if (NUMS.find((num) => num === str[i])) {
          strHold += str[i];
          continue;
        } else if (str[i] === '-' || str[i] === '.') {
          strHold += str[i];
          continue;
        } else if (str[i] === ')') {
          numbers_str.push(strHold);
          strHold = '';
          continue;
        } else if (str[i] !== '(' && str[i] !== ')') {
          calcs.push(str[i]);
          continue;
        } else {
          continue;
        }
      }
      numbers_str.push(strHold);

      //* parseFloat as decimal into array of numbers_dec
      for (let i = 0; i < numbers_str.length; i++) {
        numbers_dec.push(parseFloat(numbers_str[i]));
      }

      //* run math operations on actual decimals in proper order ('x', '/', '+')
      let opIndex = 0;
      let newArr = [];
      let newVal = 0;
      //! to keep the loop from breaking when a index of 0 is correctly found,
      //! I add 1 to the check, but not to the actual index variable.
      opIndex = calcs.indexOf('x');
      while ((opIndex = calcs.indexOf('x')) + 1) {
        newVal = numbers_dec[opIndex] * numbers_dec[opIndex + 1];
        for (let i = 0; i < numbers_dec.length; i++) {
          if (i === opIndex) {
            newArr.push(newVal);
            continue;
          } else if (i === opIndex + 1) {
            continue;
          }
          newArr.push(numbers_dec[i]);
        }
        numbers_dec = newArr;
        newArr = [];
        for (let i = 0; i < calcs.length; i++) {
          if (i === opIndex) {
            continue;
          }
          newArr.push(calcs[i]);
        }
        calcs = newArr;
        newArr = [];
        newVal = 0;
      }
      //! to keep the loop from breaking when a index of 0 is correctly found,
      //! I add 1 to the check, but not to the actual index variable.
      opIndex = calcs.indexOf('/');
      while ((opIndex = calcs.indexOf('/')) + 1) {
        newVal = numbers_dec[opIndex] / numbers_dec[opIndex + 1];
        for (let i = 0; i < numbers_dec.length; i++) {
          if (i === opIndex) {
            newArr.push(newVal);
            continue;
          } else if (i === opIndex + 1) {
            continue;
          }
          newArr.push(numbers_dec[i]);
        }
        numbers_dec = newArr;
        newArr = [];
        for (let i = 0; i < calcs.length; i++) {
          if (i === opIndex) {
            continue;
          }
          newArr.push(calcs[i]);
        }
        calcs = newArr;
        newArr = [];
        newVal = 0;
      }
      //! to keep the loop from breaking when a index of 0 is correctly found,
      //! I add 1 to the check, but not to the actual index variable.
      opIndex = calcs.indexOf('+');
      while ((opIndex = calcs.indexOf('+')) + 1) {
        newVal = numbers_dec[opIndex] + numbers_dec[opIndex + 1];
        for (let i = 0; i < numbers_dec.length; i++) {
          if (i === opIndex) {
            newArr.push(newVal);
            continue;
          } else if (i === opIndex + 1) {
            continue;
          }
          newArr.push(numbers_dec[i]);
        }
        numbers_dec = newArr;
        newArr = [];
        for (let i = 0; i < calcs.length; i++) {
          if (i === opIndex) {
            continue;
          }
          newArr.push(calcs[i]);
        }
        calcs = newArr;
        newArr = [];
        newVal = 0;
      }
      calc = numbers_dec[0];

      //* set the output and input to be the final value
      //! if calc is '0' or Scientific Notation, then we want to setup initial state
      if (calc.toString() === '0' || calc.toString().search('e') + 1) {
        state.preText = state.input + ' = ';
        state.input = calc.toString();
        state.output = null;
        state.isSymbol = true;
        state.isMinus = false;
        state.isFirstEntry = true;
        state.isDecimal = false;
        return;
      }

      //! if calc is anything but '0', then we can assume that it's ok
      //! to click on a symbol right away.
      state.preText = state.input + ' = ';
      state.input = calc.toString();
      state.output = calc.toString();
      state.isSymbol = false;
      state.isMinus = false;
      state.isFirstEntry = false;
      state.isDecimal = false;
    },
  },
});

export const { clearDisplay, addToInput, handleEquals } = displaySlice.actions;

export default displaySlice.reducer;
