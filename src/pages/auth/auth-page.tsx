import React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@store/store"
import { authThunks } from "@store/features/auth-slice/auth-thunks"
import { authSliceActions } from "@store/features/auth-slice/auth-slice"
import authImage from "@assets/images/auth/auth-image-2.png"
import PasswordInput from "@/components/password-input/PasswordInput"

import styles from "./auth-page.module.scss"

const AuthPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error } = useSelector((state: RootState) => state.auth)

    // const userId = useSelector((state: RootState) => state.auth.user.id)
    // const username = useSelector((state: RootState) => state.auth.user.name)
    // const role = useSelector((state: RootState) => state.auth.user.role)
    // console.log('userId=', userId, 'username=', username);
    // console.log("role=", role);
    
    


    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    // const [rememberMe, setRememberMe] = React.useState(true)

    const isFormFilled = email.trim() !== "" && password.trim() !== ""
    const hasServerError = error !== null

    // Очищаем ошибку при изменении полей
    React.useEffect(() => {
        if (error) {
            dispatch(authSliceActions.setError(null))
        }
    }, [email, password, dispatch, error])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormFilled) return

        dispatch(authThunks.loginUser({ email, password }))
    }

    // Определяем класс кнопки на основе состояния
    const getButtonClassName = () => {
        let stateClass = ''
        if (hasServerError) {
            stateClass = styles.buttonError
        } else if (isFormFilled) {
            stateClass = styles.buttonFilled
        } else {
            stateClass = styles.buttonNormal // Базовый стиль (пустые поля)
        }
        return `${styles.loginButton} ${stateClass}`
    }

    const getButtonText = () => {
        if (loading) return "Загрузка..."
        return "Войти"
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img alt="" src={authImage} />
            </div>
            <form className={styles.authForm} onSubmit={handleSubmit}>
                <h2>Авторизация</h2>


                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div className={styles.field}>
                    <label>Почта:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        // placeholder="Введите email"
                    />
                </div>
                <div className={styles.field}>
                    <label>Пароль:</label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        // placeholder="Введите пароль"
                    />
                </div>
                
                {/* Checkbox Remember me */}
                {/* <div className={styles.rememberMe}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div> */}
                
                <button
                    type="submit"
                    className={getButtonClassName()}
                    disabled={!isFormFilled || loading}
                >
                    {getButtonText()}
                </button>
            </form>
        </div>
    )
}

export default AuthPage