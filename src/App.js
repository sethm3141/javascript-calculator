import { useSelector } from 'react-redux';
import Button from './components/Button';
import {
  addToInput,
  clearDisplay,
  handleEquals,
} from './features/display/displaySlice';
import { useRef } from 'react';

function App() {
  const { input } = useSelector((store) => store.display);
  const warningRef = useRef('');
  warningRef.addedClass = 'add-hidden';
  warningRef.current = input.search('e') + 1;

  return (
    <main>
      <section id='calculator' className=''>
        {/* Display */}
        <div id='display' style={{ gridArea: '1 / 1 / 2 / 5' }}>
          <div>{input}</div>
        </div>
        {/* Top (first) row of buttons */}
        <Button
          id={'clear'}
          innerText={'AC'}
          grid={[2, 1, 3, 3]}
          handleClick={clearDisplay()}
        />
        <Button
          id={'divide'}
          innerText={'/'}
          grid={[2, 3, 3, 4]}
          handleClick={addToInput('/')}
        />
        <Button
          id={'multiply'}
          innerText={'x'}
          grid={[2, 4, 3, 5]}
          handleClick={addToInput('x')}
        />
        {/* Second row of buttons */}
        <Button
          id={'seven'}
          innerText={'7'}
          grid={[3, 1, 4, 2]}
          handleClick={addToInput('7')}
        />
        <Button
          id={'eight'}
          innerText={'8'}
          grid={[3, 2, 4, 3]}
          handleClick={addToInput('8')}
        />
        <Button
          id={'nine'}
          innerText={'9'}
          grid={[3, 3, 4, 4]}
          handleClick={addToInput('9')}
        />
        <Button
          id={'subtract'}
          innerText={'-'}
          grid={[3, 4, 4, 5]}
          handleClick={addToInput('-')}
        />
        {/*  Third row of buttons */}
        <Button
          id={'four'}
          innerText={'4'}
          grid={[4, 1, 5, 2]}
          handleClick={addToInput('4')}
        />
        <Button
          id={'five'}
          innerText={'5'}
          grid={[4, 2, 5, 3]}
          handleClick={addToInput('5')}
        />
        <Button
          id={'six'}
          innerText={'6'}
          grid={[4, 3, 5, 4]}
          handleClick={addToInput('6')}
        />
        <Button
          id={'add'}
          innerText={'+'}
          grid={[4, 4, 5, 5]}
          handleClick={addToInput('+')}
        />
        {/*  Fourth row of buttons */}
        <Button
          id={'one'}
          innerText={'1'}
          grid={[5, 1, 6, 2]}
          handleClick={addToInput('1')}
        />
        <Button
          id={'two'}
          innerText={'2'}
          grid={[5, 2, 6, 3]}
          handleClick={addToInput('2')}
        />
        <Button
          id={'three'}
          innerText={'3'}
          grid={[5, 3, 6, 4]}
          handleClick={addToInput('3')}
        />
        {/*  Fifth row of buttons */}
        <Button
          id={'zero'}
          innerText={'0'}
          grid={[6, 1, 7, 3]}
          handleClick={addToInput('0')}
          style={{ borderRadius: '0 0 0 1rem' }}
        />
        <Button
          id={'decimal'}
          innerText={'.'}
          grid={[6, 3, 7, 4]}
          handleClick={addToInput('.')}
        />
        <Button
          id={'equals'}
          innerText={'='}
          grid={[5, 4, 7, 5]}
          handleClick={handleEquals()}
          style={{ borderRadius: '0 0 1rem 0' }}
        />
      </section>
      <div
        id='warning-message'
        className={warningRef.current ? '' : warningRef.addedClass}
      >
        WARNING: Value Exceeded Limit, Don't Trust Returned Value.
      </div>
    </main>
  );
}

export default App;
