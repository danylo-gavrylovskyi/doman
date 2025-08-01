'use client'

import React from 'react'

import styles from "./add-attribute.module.scss"
import { useRouter } from 'next/navigation';
import { useAddAttribute } from '@/hooks/attributes.hooks';
import { TextField } from '@mui/material';

const AddAttribute = () => {
    const { push } = useRouter();

    const { mutate: addAttribute } = useAddAttribute();

    const onSaveBanner = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const title: string = (
            (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement
        ).value;

        addAttribute(title);
        push("/admin/attributes");
    };

    return (
        <>
            <header className={styles.heading}>Додавання атребуту</header>

            <form onSubmit={onSaveBanner} className={styles.form} aria-label="add attribute form">

                <section>
                    <TextField name="title" fullWidth label="Назва" />
                </section>

                <button className={styles.button} type="submit">Зберегти</button>

            </form>
        </>
    )
}

export default AddAttribute;
