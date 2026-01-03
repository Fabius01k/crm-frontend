import React from 'react';
import styles from './preloader.module.scss';

export type PreloaderSize = 'small' | 'medium' | 'large';
export type PreloaderVariant = 'fullscreen' | 'inline';

export interface PreloaderProps {
  /** Вариант прелоадера: fullscreen (на весь экран) или inline (встроенный) */
  variant?: PreloaderVariant;
  /** Размер прелоадера (применяется только для inline варианта) */
  size?: PreloaderSize;
  /** Дополнительный CSS-класс */
  className?: string;
  /** Цвет прелоадера */
  color?: string;
  /** Текст под прелоадером */
  text?: string;
  /** Прозрачность фона (для fullscreen варианта) */
  backgroundOpacity?: number;
}

/**
 * Компонент прелоадера с двумя вариантами:
 * - fullscreen: большой прелоадер на весь экран для загрузки приложения
 * - inline: маленький прелоадер для замены отдельных элементов
 */
const Preloader: React.FC<PreloaderProps> = ({
  variant = 'inline',
  size = 'medium',
  className = '',
  color,
  text,
  backgroundOpacity = 0.7,
}) => {
  // Стили для inline прелоадера
  if (variant === 'inline') {
    return (
      <div className={`${styles.preloaderInline} ${styles[size]} ${className}`}>
        <div className={styles.spinner} style={color ? { borderTopColor: color } : undefined} />
        {text && <div className={styles.text}>{text}</div>}
      </div>
    );
  }

  // Стили для fullscreen прелоадера
  return (
    <div
      className={`${styles.preloaderFullscreen} ${className}`}
      style={{ backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})` }}
    >
      <div className={styles.fullscreenContent}>
        <div className={styles.spinner} style={color ? { borderTopColor: color } : undefined} />
        {text && <div className={styles.text}>{text}</div>}
      </div>
    </div>
  );
};

export default Preloader;