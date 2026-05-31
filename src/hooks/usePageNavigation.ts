import { useEffect, useRef } from 'react';

interface UsePageNavigationProps {
  totalSections: number;
  currentSection: number;
  onNavigate: (index: number) => void;
  lockedSection?: number;        // index of section that has sub-steps
  subStepCount?: number;         // total sub-steps in locked section
  currentSubStep?: number;       // current sub-step index
  onSubStepChange?: (step: number) => void;
  cooldownMs?: number;           // default 800
  disabled?: boolean;
}

export const usePageNavigation = ({
  totalSections,
  currentSection,
  onNavigate,
  lockedSection,
  subStepCount = 0,
  currentSubStep = 0,
  onSubStepChange,
  cooldownMs = 800,
  disabled = false,
}: UsePageNavigationProps) => {
  const lastScrollTimeRef = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    if (disabled) return;

    const handleScrollAction = (direction: number) => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < cooldownMs) {
        return;
      }

      if (currentSection === lockedSection && onSubStepChange && subStepCount > 0) {
        if (direction > 0) {
          // scroll down
          if (currentSubStep < subStepCount - 1) {
            onSubStepChange(currentSubStep + 1);
            lastScrollTimeRef.current = now;
            return;
          }
        } else {
          // scroll up
          if (currentSubStep > 0) {
            onSubStepChange(currentSubStep - 1);
            lastScrollTimeRef.current = now;
            return;
          }
        }
      }

      // If we didn't return early for sub-steps, do page navigation
      if (direction > 0) {
        if (currentSection < totalSections - 1) {
          onNavigate(currentSection + 1);
          lastScrollTimeRef.current = now;
        }
      } else {
        if (currentSection > 0) {
          onNavigate(currentSection - 1);
          lastScrollTimeRef.current = now;
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (disabled) return;

      // Special projects section check
      if (currentSection === 3) {
        const container = document.querySelector('.projects-section-inner') as HTMLElement | null;
        if (container) {
          const isScrollable = container.scrollHeight > container.clientHeight + 10;
          if (isScrollable) {
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
            const isAtTop = container.scrollTop <= 15;
            const direction = e.deltaY > 0 ? 1 : -1;

            if (direction > 0 && !isAtBottom) {
              container.scrollBy({ top: e.deltaY * 0.8, behavior: 'auto' });
              e.preventDefault();
              return;
            }
            if (direction < 0 && !isAtTop) {
              container.scrollBy({ top: e.deltaY * 0.8, behavior: 'auto' });
              e.preventDefault();
              return;
            }
          }
        }
      }

      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      handleScrollAction(direction);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (disabled) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (disabled) return;

      if (currentSection === 3) {
        const container = document.querySelector('.projects-section-inner') as HTMLElement | null;
        if (container) {
          const isScrollable = container.scrollHeight > container.clientHeight + 10;
          if (isScrollable) {
            const deltaY = touchStartY.current - e.changedTouches[0].clientY;
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
            const isAtTop = container.scrollTop <= 15;

            if (deltaY > 0 && !isAtBottom) return;
            if (deltaY < 0 && !isAtTop) return;
          }
        }
      }

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        handleScrollAction(deltaY > 0 ? 1 : -1);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      // Numeric keys navigation
      if (e.key >= '1' && Number(e.key) <= totalSections) {
        onNavigate(Number(e.key) - 1);
        return;
      }

      if (currentSection === 3) {
        const container = document.querySelector('.projects-section-inner') as HTMLElement | null;
        if (container) {
          const isScrollable = container.scrollHeight > container.clientHeight + 10;
          if (isScrollable) {
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
            const isAtTop = container.scrollTop <= 15;

            if (e.key === 'ArrowDown') {
              if (!isAtBottom) {
                container.scrollBy({ top: 120, behavior: 'smooth' });
                e.preventDefault();
                return;
              }
            } else if (e.key === 'ArrowUp') {
              if (!isAtTop) {
                container.scrollBy({ top: -120, behavior: 'smooth' });
                e.preventDefault();
                return;
              }
            }
          }
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleScrollAction(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleScrollAction(-1);
      }
    };

    const wrap = document.querySelector('.portfolio-wrap') as HTMLElement | null;
    
    if (wrap) {
      wrap.addEventListener('wheel', onWheel, { passive: false });
    } else {
      window.addEventListener('wheel', onWheel, { passive: false });
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      if (wrap) {
        wrap.removeEventListener('wheel', onWheel);
      } else {
        window.removeEventListener('wheel', onWheel);
      }
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [
    disabled,
    totalSections,
    currentSection,
    onNavigate,
    lockedSection,
    subStepCount,
    currentSubStep,
    onSubStepChange,
    cooldownMs,
  ]);
};

export default usePageNavigation;
