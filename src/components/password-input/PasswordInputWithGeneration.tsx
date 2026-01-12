import React from "react"
import PasswordInput from "./PasswordInput"
import styles from "./PasswordInput.module.scss"
import createPassImage from "@assets/icons/create-password/create-pass-image.png"
import { generateStrongPassword } from "../../common/utils/create-strong-password"

interface PasswordInputWithGenerationProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onGeneratePassword?: (password: string) => void
    disabled?: boolean
    required?: boolean
    placeholder?: string
    id?: string
    name?: string
    className?: string
    error?: string
    showGenerateButton?: boolean
}

const PasswordInputWithGeneration: React.FC<PasswordInputWithGenerationProps> = ({
    value,
    onChange,
    onGeneratePassword,
    disabled = false,
    required = false,
    placeholder = "",
    id,
    name,
    className = "",
    error,
    showGenerateButton = true,
}) => {
    const handleGeneratePassword = () => {
        const newPassword = generateStrongPassword()
        // Создаем синтетическое событие для совместимости с onChange
        const syntheticEvent = {
            target: {
                value: newPassword,
                name: name || "password"
            }
        } as React.ChangeEvent<HTMLInputElement>
        
        onChange(syntheticEvent)
        
        // Вызываем дополнительный колбэк, если передан
        if (onGeneratePassword) {
            onGeneratePassword(newPassword)
        }
    }

    return (
        <div className={`${styles.passwordInputWithGenerationContainer} ${className}`}>
            <div className={styles.passwordInputWrapper}>
                <PasswordInput
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder}
                    id={id}
                    name={name}
                    className={error ? styles.inputError : ""}
                />
                {showGenerateButton && (
                    <button
                        type="button"
                        className={styles.generatePasswordButton}
                        onClick={handleGeneratePassword}
                        disabled={disabled}
                        title="Сгенерировать надежный пароль"
                    >
                        <img alt="Сгенерировать пароль" src={createPassImage} />
                    </button>
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    )
}

export default PasswordInputWithGeneration