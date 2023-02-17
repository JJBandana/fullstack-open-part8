const ButtonGroup = ({ buttons, setSelectedFilter }) => {
  return (
    <>
      {buttons.map((buttonLabel, i) => (
        <button key={i} name={buttonLabel} onClick={() => setSelectedFilter(buttonLabel)}>
          {buttonLabel}
        </button>
      ))}
    </>
  );
};

export default ButtonGroup;
