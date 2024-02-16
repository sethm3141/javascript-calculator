import { useDispatch } from 'react-redux';

const Button = ({ id, innerText, grid, handleClick, style = {} }) => {
  const dispatch = useDispatch();

  return (
    <div
      id={id}
      className='button'
      style={{
        gridArea: `${grid[0]} / ${grid[1]} / ${grid[2]} / ${grid[3]}`,
        ...style,
      }}
      onClick={() => dispatch(handleClick)}
    >
      {innerText}
    </div>
  );
};
export default Button;
