import { useEffect } from 'react';

interface UsePageNavigationProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalSections: number;
  onNavigate: (index: number) => void;
}

export const usePageNavigation = ({
  containerRef,
  totalSections,
  onNavigate,
}: UsePageNavigationProps) => {
  useEffect(() => {
    const container = containerRef.current || document.querySelector('.portfolio-wrap');
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll('.portfolio-section');
      const containerHeight = container.clientHeight;
      const containerTop = container.scrollTop;

      let activeIndex = 0;
      // Threshold is set to 40% of the viewport height down from the top edge
      const threshold = containerTop + containerHeight * 0.4;

      sections.forEach((sec, idx) => {
        const el = sec as HTMLElement;
        if (el.offsetTop <= threshold) {
          activeIndex = idx;
        }
      });

      onNavigate(activeIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef.current, totalSections, onNavigate]);
};

export default usePageNavigation;
