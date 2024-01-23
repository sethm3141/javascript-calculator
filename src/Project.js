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
    value: '*',
    name: 'multiply',
  },
  {
    value: '/',
    name: 'divide',
  },
];

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '0',
      output: '0',
    };
    this.clear = this.clear.bind(this);
    this.addToInput = this.addToInput.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  clear = () => {
    this.setState({ input: '0', output: '0' });
  };

  addToInput = (inputChar) => {
    this.setState({ input: inputChar });
  };

  render() {
    console.log(this.state);
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
        <button id='equals'>=</button>
        <button id='clear' onClick={() => this.clear()}>
          AC
        </button>
      </>
    );
  }
}
