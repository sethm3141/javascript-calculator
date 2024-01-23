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
      input: '0',
      output: '0',
      isSymbol: true,
      isMinus: false,
      isFirstEntry: true,
      isDecimal: false,
    };
    this.clear = this.clear.bind(this);
    this.addToInput = this.addToInput.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  clear = () => {
    this.setState({ input: '0', output: '0' });
  };

  handleEquals = () => {
    console.log('equals: something');
    let str = this.state.input; // input string to be processed
    let strHold = '';
    let calc = 0; // output final calculated value
    let numbers_str = []; // array of processed numbers/strings
    let numbers_dec = []; // array of processed numbers/decimal type
    let calcs = []; // array of operations that need to be ran

    //* remove -- with +
    str = str.replace('--', '+');

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
        strHold = strHold + '+(';
      }

      strHold = strHold + str[i];
    }
    strHold += ')';
    str = strHold;

    //* grab every number inside the ()'s into the array of numbers
    strHold = '';
    for (let i = 1; i < str.length - 1; i++) {
      if (NUMS.find((num) => num === str[i])) {
        
      }
      
    }

    //* grab every operation outside the ()'s into the array of calcs

    //* pass the numbers_str through conversion function that returns them as decimal into array of numbers_dec

    //* run math operations on actual decimals in proper order ('x', '/', '+')

    //* set the output and input to be the final value
    this.setState({ input: this.state.input + ' => ' + str, output: str });
  };

  addToInput = (inputChar) => {
    //* grab the old state that might change...
    let val = this.state.input;
    // console.log('---------------------');
    // console.log('val: ' + val);
    // console.log('val[last]: ' + val[val.length - 1]);
    // console.log('input: ' + inputChar);
    // console.log('new input: ' + val + inputChar);
    // console.log('symbol: ' + this.state.isSymbol);
    // console.log('minus: ' + this.state.isMinus);
    // console.log('first: ' + this.state.isFirstEntry);
    // console.log('decimal: ' + this.state.isDecimal);
    // console.log('---------------------');

    //* after hitting equals, output=something, then reset if num is hit - 01
    //TODO: do this...

    //* decimal action is handled - 02
    if (inputChar === '.') {
      console.log('tripped 02');
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
      console.log('tripped 03');
      this.setState({ input: '-0' });
      return;
    }

    //* first input when not an action - 04
    if (
      (val === '0' || val === '-0') &&
      !actions.find((action) => action.value === inputChar)
    ) {
      console.log('tripped 04');
      if (val === '-0') {
        this.setState({ input: '-' + inputChar, isSymbol: false });
        return;
      }
      this.setState({ input: inputChar, isSymbol: false });
      return;
    }

    //* no leading zeros on a number - 05
    if (inputChar === '0') {
      console.log('tripped 05');
      if (this.state.isSymbol) {
        return;
      }
    }

    //* if a +, x, /, or two - - get typed, limit input to just number next - 06
    if (
      actions.find((action) => action.value === inputChar) &&
      !(inputChar === '.')
    ) {
      console.log('tripped 06');
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
    console.log('tripped normal');
    this.setState({
      input: val + inputChar,
      isSymbol: false,
      isMinus: false,
    });
  };

  render() {
    // console.log(this.state);
    return (
      <>
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
