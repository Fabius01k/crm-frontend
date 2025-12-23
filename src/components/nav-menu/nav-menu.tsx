import { useBreakpoint } from '@hooks/use-window-width';
import { DesktopMenu } from './desctop/desktop-nav-menu';
import { MobileMenu } from './mobile/mobile-nav-menu';

const NavMenu = () => {
  const breakpoints = useBreakpoint();

  return (
    <>
      {breakpoints === 'xs' || breakpoints === 'sm' ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </>
  );
};

export default NavMenu;