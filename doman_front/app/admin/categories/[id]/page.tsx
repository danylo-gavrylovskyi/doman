'use client'

import { TextField } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

import { useEditCategory, useGetCategoryById } from '@/hooks/categories.hooks';

import styles from "../new/add-category.module.scss"

const UpdateCategory = () => {
    const { push } = useRouter();
    const { id } = useParams();

    const { data: category } = useGetCategoryById(Number(id));
    const { mutate: updateCategory } = useEditCategory();

    const onUpdateCategory = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const title: string = (
            (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement
        ).value;

        const fileInput = (event.target as HTMLFormElement).elements.namedItem(
            "image"
        ) as HTMLInputElement;

        const image = fileInput?.files ? fileInput.files[0] : null;

        const formData = new FormData();
        if (title) formData.append("title", title);
        if (image) formData.append("image", image);

        updateCategory({ id: Number(id), formData });
        push("/admin/categories");
    };

    if (!category) {
        return <div>Loading category...</div>
    }

    return (
        <>
            <header className={styles.heading}>Редагування категорії</header>

            <form onSubmit={onUpdateCategory} className={styles.form} aria-label="add category form">

                <div className={styles.row}>
                    <section style={{ width: "35dvw" }}>
                        <TextField defaultValue={category.title} name="title" fullWidth label="Назва" />
                    </section>

                    <section style={{ whiteSpace: "nowrap" }}>
                        <label className={styles.button} htmlFor="categoryImg">
                            Завантажити обкладинку
                        </label>
                        <input name="image" id="categoryImg" type="file"></input>
                    </section>
                </div>

                <button className={styles.button} type="submit">Зберегти</button>

            </form>
        </>
    )
}

export default UpdateCategory;
