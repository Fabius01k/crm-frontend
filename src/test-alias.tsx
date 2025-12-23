// Тестовый файл для проверки алиасов
import { PATHS } from '@router/paths';
import { store } from '@store/store';
import { useAppDispatch } from '@store/store';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '@constants/constants';
import AuthPage from '@pages/auth/auth-page';

// Проверка типов
const testPaths = PATHS;
const testStore = store;
const testDispatch = useAppDispatch;
const testConstant = LOCAL_STORAGE_ACCESS_TOKEN;
const TestAuthPage = AuthPage;

console.log('Алиасы работают:', {
  testPaths,
  testStore,
  testDispatch,
  testConstant,
  TestAuthPage,
});

export default function TestAlias() {
  return null;
}