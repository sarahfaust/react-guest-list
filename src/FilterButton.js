export function FilterButton(props) {
  return (
    <button
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      {props.name}
    </button>
  );
}
