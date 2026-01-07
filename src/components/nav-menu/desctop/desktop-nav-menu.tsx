import { Link, useLocation } from "react-router"
import { navMenuItems, adminNavMenuItems } from "../info"
import { useState } from "react"

import menuArrowRight from "@assets/icons/menu/menu-arrow-right.svg"

import "./desktop-nav-menu.scss"
import type { UserRoleType } from "@/store/features/auth-slice/auth-types"
import { useAppSelector } from "@/store/store"

export const DesktopMenu = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentUserRole: UserRoleType = useAppSelector(state => state.auth.user.role)
  const isAdminMenuAccessible: boolean = currentUserRole === "teamlead"

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <nav className={`desktop-nav-menu ${isOpen ? 'desktop-nav-menu--open' : ''}`}>
        <div className="desktop-nav-menu__items">
          {navMenuItems.map((menuItem) => {
            const isActive = location.pathname === menuItem.link
            
            return (
              <div key={menuItem.index} className="desktop-nav-menu__item">
                <Link
                  to={menuItem.link}
                  className={`desktop-nav-menu__link ${isActive ? 'desktop-nav-menu__link--active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="menuItemRow">
                    <div className="menuItemIcon">
                      {menuItem.img && <img alt="" src={menuItem.img} />}
                    </div>
                    <div className={`menuItemtext ${isOpen ? 'menuItemtext--visible' : ''}`}>
                      {menuItem.title}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}

          {
            isAdminMenuAccessible && (
              <>
                <div className="desktop-nav-menu__divider"></div>
                {adminNavMenuItems.map((menuItem) => {
                    const isActive = location.pathname === menuItem.link
                    
                    return (
                      <div key={menuItem.index} className="desktop-nav-menu__item">
                        <Link
                          to={menuItem.link}
                          className={`desktop-nav-menu__link ${isActive ? 'desktop-nav-menu__link--active' : ''}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="menuItemRow">
                            <div className="menuItemIcon">
                              {menuItem.img && <img alt="" src={menuItem.img} />}
                            </div>
                            <div className={`menuItemtext ${isOpen ? 'menuItemtext--visible' : ''}`}>
                              {menuItem.title}
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </>
            )
          }

        </div>
        
        <button
          className="desktop-nav-menu__toggle"
          onClick={toggleMenu}
        >
          <div className="menuItemIcon">
            <img
              alt={isOpen ? "Закрыть меню" : "Открыть меню"}
              src={menuArrowRight}
              className={isOpen ? "desktop-nav-menu__toggle-icon--rotated" : ""}
            />
          </div>
        </button>
      </nav>
    </>
  )
}