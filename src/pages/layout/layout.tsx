import { Footer } from "@/widgets/footer/footer"
import { Header } from "@/widgets/header/header"
import { Outlet } from "react-router"
import styles from "./layout.module.scss"
import NavMenu from "@/components/nav-menu/nav-menu"
import { LOCAL_STORAGE_ACCESS_TOKEN } from "@/constants/constants"
import { useEffect } from "react"
import { useAppDispatch } from "@/store/store"
import { userThunks } from "@/store/features/user-slice/user-thunks"

export const Layout = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token) {
            // Можно сделать запрос для проверки токена
            // Если токен невалиден, интерцептор попытается обновить его
            // или редиректнет на /auth
            dispatch(userThunks.fetchCurrentUserProfile())
        }
    }, []);
    
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <Header />
            </header>
            <NavMenu />

            <main className={styles.main}>
                <Outlet />
            </main>
            <footer className={styles.footer}>
                <Footer />
            </footer>
        </div>
    )
}