import { type ChangeEvent, useState } from 'react';
import searchIcon from '@assets/icons/search.svg';
import styles from './users-page.module.scss';

interface UserSearchFormProps {
    onSearch: (query: string) => void;
}

export const UserSearchForm = ({ onSearch }: UserSearchFormProps) => {
    const [query, setQuery] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
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