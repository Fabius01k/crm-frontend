import React from "react"
import eyeOpenIcon from "@assets/icons/auth/eye-1.png"
import eyeClosedIcon from "@assets/icons/auth/eye-2.png"
import styles from "./PasswordInput.module.scss"

interface PasswordInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    required?: boolean
    placeholder?: string
    id?: string
    name?: string
    className?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChange,
    disabled = false,
    required = false,
    placeholder = "",
    id,
    name,
    className = "",
}) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
        console.log('Toggle password visibility, current showPassword:', showPassword)
        setShowPassword((prev) => !prev)
    }

    console.log('Rendering PasswordInput, showPassword:', showPassword, 'type:', showPassword ? 'text' : 'password')

    return (
        <div className={`${styles.passwordInputContainer} ${className}`}>
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                id={id}
                name={name}
                className={styles.input}
            />
            <button
                type="button"
                className={styles.toggleButton}
                onClick={togglePasswordVisibility}
                disabled={disabled}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
                <img
                    src={showPassword ? eyeClosedIcon : eyeOpenIcon}
                    alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    className={styles.icon}
                />
            </button>
        </div>
    )
}

export default PasswordInput