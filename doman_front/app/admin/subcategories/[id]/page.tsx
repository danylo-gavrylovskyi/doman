'use client'

import { MenuItem, TextField } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

import { useGetCategories } from '@/hooks/categories.hooks';
import { useEditSubcategory, useGetSubcategoryById } from '@/hooks/subcategories.hooks';

import { Category } from '@/types/category.interface';

import styles from "../new/add-subcategory.module.scss"

const UpdateSubcategory = () => {
    const { push } = useRouter();
    const { id } = useParams();

    const { data: subcategory } = useGetSubcategoryById(Number(id));
    const { data: categories } = useGetCategories();
    const updateSubcategory = useEditSubcategory();

    const onUpdateSubcategory = (event: React.FormEvent<HTMLFormElement>) => {
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
        if (title) formData.append("title", title);
        if (categoryId) formData.append("categoryId", categoryId);
        if (image) formData.append("image", image);

        updateSubcategory({ id: Number(id), formData });
        push("/admin/subcategories");
    };

    if (!subcategory) {
        return <div>Loading subcategory...</div>
    }

    return (
        <>
            <header className={styles.heading}>Редагування підкатегорії</header>

            <form onSubmit={onUpdateSubcategory} className={styles.form} aria-label="add subcategory form">

                <div className={styles.row}>
                    <section style={{ width: "35dvw" }}>
                        <TextField defaultValue={subcategory.title} name="title" fullWidth label="Назва" />
                    </section>

                    <section>
                        <TextField
                            name="categoryId"
                            className={styles.select}
                            select
                            label="Категорія"
                            defaultValue={subcategory.categoryId}
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

export default UpdateSubcategory;
