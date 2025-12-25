import { PATHS } from "@router/paths"

import hubIcon from "@assets/icons/menu/CgTeamHub.svg";
import homeIcon from "@/assets/icons/menu/Home.svg"
import calendarIcon from "@/assets/icons/menu/Calendar.svg"

export type NavMenuType = {
    index: number,
    title: string,
    link: string,
    img?: string,
}

export const adminNavMenuItems: NavMenuType[] = [
    {
        index: 0,
        title: "Авторизация",
        link: PATHS.auth,
        img: hubIcon,
    },
    {
        index: 1,
        title: "Главная страница",
        link: PATHS.root,
        img: homeIcon,
    },
    {
        index: 2,
        title: "Пользователи",
        link: PATHS.users,
        img: calendarIcon,
    },
    {
        index: 3,
        title: "Профиль",
        link: PATHS.profile,
        img: calendarIcon,
    },
]