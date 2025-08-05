import { useRouter } from 'next/navigation';
import React from 'react'

import { perPageOptions } from '@/types/constants/perPageOptions'

import styles from "./perPageSelector.module.scss"

export const PerPageSelector = ({ perPage }: { perPage: number }) => {
    const router = useRouter();

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = e.target.value;
        router.push(`?page=1&perPage=${newPerPage}`);
    };

    return (
        <div className={styles.perPageSelect}>
            <label htmlFor="perPage">На сторінці: </label>
            <select id="perPage" value={perPage} onChange={handlePerPageChange}>
                {perPageOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}
