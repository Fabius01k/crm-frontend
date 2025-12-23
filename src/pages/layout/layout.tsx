import { Footer } from "@/widgets/footer/footer"
import { Header } from "@/widgets/header/header"
import { Outlet } from "react-router"
import styles from "./layout.module.scss"
import NavMenu from "@/components/nav-menu/nav-menu"

export const Layout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <Header />
            </header>
            <main className={styles.main}>
                <NavMenu />
                <Outlet />
            </main>
            <footer className={styles.footer}>
                <Footer />
            </footer>
        </div>
    )
}