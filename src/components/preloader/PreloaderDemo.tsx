import React from 'react';
import Preloader from './preloader';
import './preloader.module.scss';

const PreloaderDemo: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Демонстрация компонента Preloader</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Inline прелоадеры (маленькие для замены элементов)</h2>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h3>Small</h3>
            <Preloader variant="inline" size="small" text="Загрузка..." />
          </div>
          <div>
            <h3>Medium (по умолчанию)</h3>
            <Preloader variant="inline" size="medium" text="Загрузка данных" />
          </div>
          <div>
            <h3>Large</h3>
            <Preloader variant="inline" size="large" text="Пожалуйста, подождите" />
          </div>
          <div>
            <h3>С кастомным цветом</h3>
            <Preloader variant="inline" size="medium" color="#ff6b6b" text="Обработка..." />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Fullscreen прелоадер (большой на весь экран)</h2>
        <div style={{ position: 'relative', height: '300px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem' }}>
            <p>Имитация fullscreen прелоадера внутри контейнера:</p>
            <button onClick={() => alert('Кнопка работает')}>Тестовая кнопка</button>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Preloader 
              variant="fullscreen" 
              text="Загрузка приложения..." 
              backgroundOpacity={0.8}
              color="#3498db"
            />
          </div>
        </div>
        <p style={{ marginTop: '1rem' }}>
          <small>Примечание: В реальном использовании fullscreen прелоадер должен быть position: fixed поверх всего интерфейса.</small>
        </p>
      </section>

      <section>
        <h2>Использование в контексте</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1, border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
            <h3>Загрузка таблицы</h3>
            <div style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Preloader variant="inline" size="medium" text="Загрузка данных таблицы..." />
            </div>
          </div>
          <div style={{ flex: 1, border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
            <h3>Загрузка профиля</h3>
            <div style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Preloader variant="inline" size="small" text="Загрузка профиля..." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreloaderDemo;