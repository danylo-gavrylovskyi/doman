'use client'

import { useRouter } from 'next/navigation';
import React from 'react'

import { useAddBanner } from '@/hooks/banners.hooks';

import styles from "./add-banner.module.scss"

const AddBanner = () => {
    const { push } = useRouter();

    const { mutate: addBanner } = useAddBanner();

    const onSaveBanner = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fileInput = (event.target as HTMLFormElement).elements.namedItem(
            "image"
        ) as HTMLInputElement;

        const image = fileInput?.files ? fileInput.files[0] : null;

        if (image) {
            addBanner(image);
        }
        push("/admin/banners");
    };

    return (
        <>
            <header className={styles.heading}>Додавання банеру</header>

            <form onSubmit={onSaveBanner} className={styles.form} aria-label="add banner form">

                <section style={{ whiteSpace: "nowrap" }}>
                    <label className={styles.button} htmlFor="bannerImg">
                        Завантажити банер
                    </label>
                    <input name="image" id="bannerImg" type="file"></input>
                </section>

                <button className={styles.button} type="submit">Зберегти</button>

            </form>
        </>
    )
}

export default AddBanner;
