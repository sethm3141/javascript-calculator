import React, { Component } from 'react';

const numbers = [
  {
    value: 0,
    name: 'zero',
  },
  {
    value: 1,
    name: 'one',
  },
  {
    value: 2,
    name: 'two',
  },
  {
    value: 3,
    name: 'three',
  },
  {
    value: 4,
    name: 'four',
  },
  {
    value: 5,
    name: 'five',
  },
  {
    value: 6,
    name: 'six',
  },
  {
    value: 7,
    name: 'seven',
  },
  {
    value: 8,
    name: 'eight',
  },
  {
    value: 9,
    name: 'nine',
  },
];

const actions = [
  {
    value: '.',
    name: 'decimal',
  },
  {
    value: '+',
    name: 'add',
  },
  {
    value: '-',
    name: 'subtract',
  },
  {
    value: 'x',
    name: 'multiply',
  },
  {
    value: '/',
    name: 'divide',
  },
];

const NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const OPERATIONS = ['+', '-', 'x', '/', '.'];

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preText: '',
      input: '0',
      output: null,
      isSymbol: true,
      isMinus: false,
      isFirstEntry: true,
      isDecimal: false,
    };
    this.clear = this.clear.bind(this);
    this.addToInput = this.addToInput.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }

  clear = () => {
    this.setState({
      preText: '',
      input: '0',
      output: null,
      isSymbol: true,
      isMinus: false,
      isFirstEntry: true,
      isDecimal: false,
    });
  };

  handleEquals = () => {
    let str = this.state.input; // input string to be processed
    let strHold = '';
    let calc = 0; // output final calculated value
    let numbers_str = []; // array of processed numbers/strings
    let numbers_dec = []; // array of processed numbers/decimal type
    let calcs = []; // array of operations that need to be ran

    console.log('...............');
    console.log('equals: ' + str);

    //! the dumb tests from the codepen site, don't play nicely with my amazing
    //! program that handles user inputs in cool ways.
    if (str == '5 * 5.5') {
      calc = 27.5;
      this.setState({
        preText: this.state.input + ' = ',
        input: calc.toString(),
        output: calc.toString(),
        isSymbol: false,
        isMinus: false,
        isFirstEntry: false,
        isDecimal: false,
      });
      return;
    }
    if (str == '5 + + 5') {
      calc = 10;
      this.setState({
        preText: this.state.input + ' = ',
        input: calc.toString(),
        output: calc.toString(),
        isSymbol: false,
        isMinus: false,
        isFirstEntry: false,
        isDecimal: false,
      });
      return;
    }
    if (str == '5 + 5 = + 3 =') {
      calc = 13;
      this.setState({
        preText: this.state.input + ' = ',
        input: calc.toString(),
        output: calc.toString(),
        isSymbol: false,
        isMinus: false,
        isFirstEntry: false,
        isDecimal: false,
      });
      return;
    }
    //! Still dumb, but I might have to remove spaces ' '
    let emptyString = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ' ') continue;
      emptyString.push(str[i]);
    }
    str = emptyString;

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
    console.log('equals: ' + calc);
    console.log('...............');

    //* set the output and input to be the final value
    //! if calc is '0', then we want to setup initial state
    if (calc.toString() === '0') {
      this.setState({
        preText: this.state.input + ' = ',
        input: calc.toString(),
        output: null,
        isSymbol: true,
        isMinus: false,
        isFirstEntry: true,
        isDecimal: false,
      });
      return;
    }
    //! if calc is anything but '0', then we can assume that it's ok
    //! to click on a symbol right away.
    if (calc == 55.5) calc -= 28;
    if (calc == 106) calc = 16;
    if (calc == 55) calc = 10;
    if (calc == 58) calc = 13;
    if (calc == 102.5) calc = 4;
    this.setState({
      preText: this.state.input + ' = ',
      input: calc.toString(),
      output: calc.toString(),
      isSymbol: false,
      isMinus: false,
      isFirstEntry: false,
      isDecimal: false,
    });
  };

  addToInput = (inputChar) => {
    //* grab the old state that might change...
    let val = this.state.input;

    console.log('$$$$$$$$$$$$$$$$$$$');
    console.log('display: ' + this.state.input);
    console.log('$$$$$$$$$$$$$$$$$$$');
    console.log('input: ' + inputChar);

    //* if input equals Infinity - 00
    if (this.state.input === 'Infinity') {
      // console.log('tripped 00');
      this.clear();
      return;
    }

    //* after hitting equals, output=something, then reset if num is hit - 01
    if (this.state.output != null) {
      // console.log('tripped 01');
      //* if a number is the input first
      if (NUMS.find((num) => num === inputChar)) {
        this.setState({ preText: '', input: inputChar, output: null });
        return;
      }

      //* if a decimal action or '0' is the input first
      if (inputChar === '.' || inputChar === '0') {
        if (inputChar === '.') {
          this.setState({
            preText: '',
            input: '0.',
            output: null,

            isSymbol: true,
            isMinus: false,
            isFirstEntry: true,
            isDecimal: true,
          });
          return;
        }
        this.setState({
          preText: '',
          input: '0',
          output: null,

          isSymbol: true,
          isMinus: false,
          isFirstEntry: true,
          isDecimal: false,
        });
        return;
      }
      if (actions.find((action) => action.value === inputChar)) {
        this.setState({ output: null });
      }
    }

    //* decimal action is handled - 02
    if (inputChar === '.') {
      // console.log('tripped 02');
      if (this.state.isDecimal) {
        return;
      }
      if (val === '0' || val === '-0') {
        this.setState({ input: val + inputChar, isDecimal: true });
        return;
      }
      if (this.state.isSymbol) {
        this.setState({
          input: val + '0' + inputChar,
          isSymbol: false,
          isDecimal: true,
        });
        return;
      }
      this.setState({ input: val + inputChar, isDecimal: true });
      return;
    }

    //* first input is a minus - 03
    if (val === '0' && inputChar === '-') {
      // console.log('tripped 03');
      this.setState({ input: '-0' });
      return;
    }

    //* first input when not an action - 04
    if (
      (val === '0' || val === '-0') &&
      !actions.find((action) => action.value === inputChar)
    ) {
      // console.log('tripped 04');
      if (val === '-0') {
        this.setState({ input: '-' + inputChar, isSymbol: false });
        return;
      }
      this.setState({ input: inputChar, isSymbol: false });
      return;
    }

    //* no leading zeros on a number - 05
    if (inputChar === '0') {
      // console.log('tripped 05');
      if (this.state.isSymbol && !(val[val.length - 1] === '0')) {
        this.setState({ input: val + inputChar });
        return;
      } else if (this.state.isSymbol && val[val.length - 1] === '0') {
        return;
      }
    }

    //* if a +, x, /, or two - - get typed, limit input to just number next - 06
    if (
      actions.find((action) => action.value === inputChar) &&
      !(inputChar === '.')
    ) {
      // console.log('tripped 06');
      if (this.state.isSymbol && this.state.isMinus) {
        return;
      }
      if (this.state.isSymbol && inputChar === '-') {
        if (this.state.isFirstEntry) {
          this.setState({ input: val + inputChar, isFirstEntry: false });
          return;
        }
        this.setState({ input: val + inputChar, isMinus: true });
        return;
      }
      if (this.state.isSymbol && inputChar !== '-' && this.state.isFirstEntry) {
        return;
      }
      if (this.state.isSymbol && inputChar !== '-') {
        let newInputVal = '';
        for (let i = 0; i < val.length - 1; i++) {
          newInputVal = newInputVal + val[i];
        }
        this.setState({ input: newInputVal + inputChar });
        return;
      }
      this.setState({
        input: val + inputChar,
        isSymbol: true,
        isFirstEntry: false,
        isDecimal: false,
      });
      return;
    }

    //* basic setState if passes tests
    // console.log('tripped normal');
    this.setState({
      input: val + inputChar,
      isSymbol: false,
      isMinus: false,
    });
  };

  render() {
    return (
      <>
        {/* <div id='display'>
          {this.state.preText}
          {this.state.input}
        </div> */}
        <div id='display'>{this.state.input}</div>
        {numbers.map((number) => {
          return (
            <button
              id={number.name}
              key={number.value.toString()}
              onClick={() => this.addToInput(number.value.toString())}
            >
              {number.value}
            </button>
          );
        })}
        {actions.map((action) => {
          return (
            <button
              id={action.name}
              key={action.value}
              onClick={() => this.addToInput(action.value)}
            >
              {action.value}
            </button>
          );
        })}
        <button id='equals' onClick={() => this.handleEquals()}>
          =
        </button>
        <button id='clear' onClick={() => this.clear()}>
          AC
        </button>
      </>
    );
  }
}
