import { Link, useLocation } from "react-router"
import { adminNavMenuItems } from "../info"
import { useState } from "react"

import menuArrowRight from "@assets/icons/menu/menu-arrow-right.svg"
import menuArrowLeft from "@assets/icons/menu/menu-arrow-left.svg"

import "./desktop-nav-menu.scss"

export const DesktopMenu = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <nav className={`desktop-nav-menu ${isOpen ? 'desktop-nav-menu--open' : ''}`}>
        <div className="desktop-nav-menu__items">
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
        </div>
        
        <button
          className="desktop-nav-menu__toggle"
          onClick={toggleMenu}
        >
          <div className="menuItemRow">
            <div className="menuItemIcon">
              <img
                alt={isOpen ? "Закрыть меню" : "Открыть меню"}
                src={isOpen ? menuArrowLeft : menuArrowRight}
              />
            </div>
            <div className={`menuItemtext ${isOpen ? 'menuItemtext--visible' : ''}`}>
              {isOpen ? "Свернуть" : "Развернуть"}
            </div>
          </div>
        </button>
      </nav>
    </>
  )
}