import { useState, useEffect } from 'react';

/**
 * Breakpoints для стандартных размеров экранов.
 */
export const BREAKPOINTS = {
  xs: 0,     // extra small
  sm: 576,   // small
  md: 768,   // medium
  lg: 992,   // large
  xl: 1200,  // extra large
  xxl: 1400, // extra extra large
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Определяет текущий breakpoint на основе ширины окна.
 * @param width - Текущая ширина окна.
 * @returns {Breakpoint} Ключ breakpoint.
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Хук для получения текущей ширины окна браузера.
 * @returns {number} Текущая ширина окна в пикселях.
 *
 * @example
 * // Использование в функциональном компоненте:
 * function MyComponent() {
 *   const width = useWindowWidth();
 *
 *   return (
 *     <div>
 *       Ширина окна: {width}px
 *       {width < 768 && <MobileView />}
 *       {width >= 768 && <DesktopView />}
 *     </div>
 *   );
 * }
 */
export const useWindowWidth = (): number => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Вызываем сразу, чтобы установить актуальное значение
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
};

/**
 * Хук для получения текущего breakpoint экрана.
 * @returns {Breakpoint} Текущий breakpoint.
 *
 * @example
 * function ResponsiveComponent() {
 *   const breakpoint = useBreakpoint();
 *
 *   return (
 *     <div>
 *       {breakpoint === 'xs' && <ExtraSmallView />}
 *       {breakpoint === 'sm' && <SmallView />}
 *       {breakpoint === 'md' && <MediumView />}
 *       {breakpoint === 'lg' && <LargeView />}
 *       {breakpoint === 'xl' && <ExtraLargeView />}
 *     </div>
 *   );
 * }
 */
export const useBreakpoint = (): Breakpoint => {
  const width = useWindowWidth();
  return getBreakpoint(width);
};

/**
 * Хук для получения полной информации о размере экрана.
 * @returns {Object} Объект с шириной и breakpoint.
 *
 * @example
 * function ScreenInfo() {
 *   const { width, breakpoint } = useScreenSize();
 *
 *   return (
 *     <div>
 *       <p>Ширина: {width}px</p>
 *       <p>Breakpoint: {breakpoint}</p>
 *     </div>
 *   );
 * }
 */
export const useScreenSize = () => {
  const width = useWindowWidth();
  const breakpoint = getBreakpoint(width);

  return { width, breakpoint };
};