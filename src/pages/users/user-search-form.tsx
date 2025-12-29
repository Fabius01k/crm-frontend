import { type ChangeEvent, useState, useEffect, useRef } from 'react';
import searchIcon from '@assets/icons/search.svg';
import styles from './users-page.module.scss';
import { useDebounce } from '@hooks/use-debounce.ts';
import { useAppDispatch, useAppSelector } from '@store/store';
import { userSliceActions } from '@store/features/user-slice/user-slice';

export const UserSearchForm = () => {
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector((state) => state.user.searchQuery);
    const [inputValue, setInputValue] = useState(searchQuery);
    const debouncedInputValue = useDebounce(inputValue, 500);
    const isExternalUpdate = useRef(false);

    // Синхронизация inputValue с Redux searchQuery при изменении извне
    useEffect(() => {
        isExternalUpdate.current = true;
        setInputValue(searchQuery);
    }, [searchQuery]);

    // При изменении дебаунсированного значения обновляем Redux
    useEffect(() => {
        if (isExternalUpdate.current) {
            isExternalUpdate.current = false;
            return;
        }
        if (debouncedInputValue !== searchQuery) {
            dispatch(userSliceActions.setSearchQuery(debouncedInputValue));
        }
    }, [debouncedInputValue, dispatch, searchQuery]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        isExternalUpdate.current = false;
        setInputValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Отправка запроса на поиск (обрабатывается в UsersPage через эффект)
        // Дополнительных действий не требуется, так как searchQuery уже обновлен
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            <div className={styles.searchInputWrapper}>
                <div className={styles.searchIcon}>
                    <img src={searchIcon} alt="Поиск" width={20} height={20} />
                </div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Поиск по имени или телефону"
                    value={inputValue}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};
