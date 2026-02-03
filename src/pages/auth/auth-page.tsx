import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "@store/store";
import { authThunks } from "@store/features/auth-slice/auth-thunks";
import { authSliceActions } from "@store/features/auth-slice/auth-slice";
import PasswordInput from "@/components/password-input/PasswordInput";
import styles from "./auth-page-new.module.scss";
import { PATHS } from "@/router/paths";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "@/constants/constants";

const AuthPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const isFormFilled = email.trim() !== "" && password.trim() !== "";
  const hasServerError = error !== null;

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    if (token && !loading && !error) {
      navigate(PATHS.root, { replace: true });
    }
  }, [loading, error, navigate]);

  // Очищаем ошибку при изменении полей
  React.useEffect(() => {
    if (error) {
      dispatch(authSliceActions.setError(null));
    }
  }, [email, password, dispatch, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormFilled) return;

    dispatch(authThunks.loginUser({ email, password }));
  };

  // Определяем класс кнопки на основе состояния
  const getButtonClassName = () => {
    let stateClass = "";
    if (hasServerError) {
      stateClass = styles.buttonError;
    } else if (isFormFilled) {
      stateClass = styles.buttonFilled;
    } else {
      stateClass = styles.buttonNormal;
    }
    return `${styles.loginButton} ${stateClass}`;
  };

  const getButtonText = () => {
    if (loading) return <span className={styles.loadingText}>Загрузка...</span>;
    return "Войти";
  };

  return (
    <div className={styles.authContainer}>
      {/* Заголовок */}
      <div className={styles.header}>
        <h1>
          Добро пожаловать в <span className={styles.brand}>TeamHub</span>
        </h1>
        <p className={styles.subtitle}>Твой виртуальный офис</p>
      </div>

      {/* Основная карточка */}
      <div className={styles.mainCard}>
        {/* Левая часть (Текст) */}
        <div className={styles.textSection}>
          <p className={styles.description}>
            Внутренняя CRM-система для управления сотрудниками и рабочими
            процессами
          </p>
        </div>

        {/* Правая часть (Форма) */}
        <div className={styles.formSection}>
          <h2>Авторизация</h2>

          <form className={styles.authForm} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <label>Почта:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                placeholder="example@mail.com"
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.field}>
              <label>Пароль:</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className={styles.passwordInput}
                inputClassName={styles.fieldInput}
              />
            </div>

            <button
              type="submit"
              className={getButtonClassName()}
              disabled={!isFormFilled || loading}
            >
              {getButtonText()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
