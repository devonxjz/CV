interface ScrollHintProps {
  hidden: boolean;
}

const ScrollHint = ({ hidden }: ScrollHintProps) => {
  return (
    <div className={`scroll-hint${hidden ? ' hidden' : ''}`}>
      <div className="scroll-hint-arrow" />
    </div>
  );
};

export default ScrollHint;
