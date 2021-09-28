export function FilterButton(props) {
  return (
    <button
      aria-pressed={props.isPressed}
      onClick={() => props.setFilterShow(props.name)}
    >
      {props.name}
    </button>
  );
}
