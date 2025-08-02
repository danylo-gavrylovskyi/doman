'use client'

import React from 'react'

import styles from "./add-category.module.scss"
import { useRouter } from 'next/navigation';
import { TextField } from '@mui/material';
import { useAddCategory } from '@/hooks/categories.hooks';
import slugify from 'slugify';

const AddCategory = () => {
    const { push } = useRouter();

    const { mutate: addCategory } = useAddCategory();

    const onSaveCategory = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const title: string = (
            (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement
        ).value;

        const fileInput = (event.target as HTMLFormElement).elements.namedItem(
            "image"
        ) as HTMLInputElement;

        const image = fileInput?.files ? fileInput.files[0] : null;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("slug", slugify(title));
        if (image === null) {
            throw new Error("You didn't choose the file");
        }
        formData.append("image", image);

        addCategory(formData);
        push("/admin/categories");
    };

    return (
        <>
            <header className={styles.heading}>Додавання категорії</header>

            <form onSubmit={onSaveCategory} className={styles.form} aria-label="add category form">

                <div className={styles.row}>
                    <section style={{ width: "35dvw" }}>
                        <TextField name="title" fullWidth label="Назва" />
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

export default AddCategory;
