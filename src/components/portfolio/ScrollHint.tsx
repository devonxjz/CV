interface ScrollHintProps {
  hidden: boolean;
}

const ScrollHint = ({ hidden }: ScrollHintProps) => {
  return (
    <div className={`scroll-hint${hidden ? ' hidden' : ''}`}>
      <span className="scroll-hint-text">scroll</span>
      <div className="scroll-hint-arrow" />
    </div>
  );
};

export default ScrollHint;
