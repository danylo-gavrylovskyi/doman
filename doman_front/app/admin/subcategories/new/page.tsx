'use client'

import React from 'react'

import styles from "./add-subcategory.module.scss"
import { useRouter } from 'next/navigation';
import { MenuItem, TextField } from '@mui/material';
import { useGetCategories } from '@/hooks/categories.hooks';
import { Category } from '@/types/category.interface';
import { useAddSubcategory } from '@/hooks/subcategories.hooks';
import slugify from 'slugify';

const AddSubcategory = () => {
    const { push } = useRouter();

    const { data: categories } = useGetCategories();
    const addSubcategory = useAddSubcategory();

    const onSaveSubcategory = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const categoryId: string = (
            (event.target as HTMLFormElement).elements.namedItem("categoryId") as HTMLInputElement
        ).value;

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
        formData.append("categoryId", categoryId);
        if (image === null) {
            throw new Error("You didn't choose the file");
        }
        formData.append("image", image);

        addSubcategory(formData);
        push("/admin/subcategories");
    };

    return (
        <>
            <header className={styles.heading}>Додавання підкатегорії</header>

            <form onSubmit={onSaveSubcategory} className={styles.form} aria-label="add subcategory form">

                <div className={styles.row}>
                    <section style={{ width: "35dvw" }}>
                        <TextField name="title" fullWidth label="Назва" />
                    </section>

                    <section>
                        <TextField
                            name="categoryId"
                            className={styles.select}
                            select
                            label="Категорія"
                            defaultValue=""
                            style={{ minWidth: "10dvw" }}
                        >
                            {categories?.length ? (
                                categories.map((category: Category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.title}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    Завантаження категорій...
                                </MenuItem>
                            )}
                        </TextField>
                    </section>

                    <section style={{ whiteSpace: "nowrap" }}>
                        <label className={styles.button} htmlFor="subcategoryImg">
                            Завантажити обкладинку
                        </label>
                        <input name="image" id="subcategoryImg" type="file"></input>
                    </section>
                </div>

                <button className={styles.button} type="submit">Зберегти</button>

            </form>
        </>
    )
}

export default AddSubcategory;
