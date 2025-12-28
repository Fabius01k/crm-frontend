import { type ChangeEvent, useState, useEffect } from 'react';
import searchIcon from '@assets/icons/search.svg';
import styles from './users-page.module.scss';
import { useDebounce } from '@hooks/use-debounce.ts';

interface UserSearchFormProps {
    onSearch: (query: string) => void;
}

export const UserSearchForm = ({ onSearch }: UserSearchFormProps) => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 1000);

    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Отправка запроса на сервер для поиска");
        alert("Отправка запроса на сервер для поиска")
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
                    value={query}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};
