## Admin Panel

### Introduction

The Admin Panel is a centralized interface designed for administrators to manage various aspects of the application, including products, categories, banners, and more. This documentation offers insights into each component of the admin panel, providing explanations, implementation details, and code examples for reference.

### Table of Contents
1. [Admin Attributes](#1-admin-attributes)
2. [Admin Categories](#2-admin-categories)
3. [Add Product](#3-add-product)
4. [Admin Banners](#4-admin-banners)
5. [Admin Products](#5-admin-products)
6. [Admin Subcategories](#6-admin-subcategories)
7. [Admin Layout](#7-admin-layout)

### 1. Admin Attributes

#### Description
The Admin Attributes component allows administrators to manage attributes for products. Attributes define additional properties or characteristics that products may have.

#### Code Example (Saving Attribute)
```jsx
// admin/attributes/page.jsx

const onSaveAttribute = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const title: string = (
    (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement
  ).value;

  addAttribute(title);
  changeAddingMode((prev) => !prev);
};
```

#### Implementation Details
- Utilizes hooks for fetching attributes from the server and managing state.
- Provides functionality for adding and deleting attributes.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/86df53cf-774b-4e37-8d70-a451be742e05)

### 2. Admin Categories

#### Description
The Admin Categories component allows administrators to manage product categories. Categories help in organizing and grouping similar products together.

#### Code Example (Category Editing)
```jsx
// components/AdminCategory/AdminCategory.jsx

const onSaveEditCategory: SubmitHandler<{ title: string }> = (values) => {
  const formData = new FormData();
  
  values.title && formData.append("title", values.title);
  uploadedImage && formData.append("image", uploadedImage);
  
  edit({ id, formData });
  changeEditingMode((prev) => !prev);
};
```

#### Implementation Details
- Fetches categories data from the server using hooks.
- Allows adding, editing, and deleting categories.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/5291f368-869e-47e6-8e33-ce27d8cfe136)

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/ce24979d-b2ac-49b0-bef4-f57d9327ea2e)

### 3. Add Product

#### Description
The Add Product component enables administrators to add new products to the system. It provides a form for entering product details such as title, description, price, etc.

#### Code Example (Form Submission)
```jsx
// admin/products/new/page.jsx

const onSaveProduct: SubmitHandler<CreateProductForm> = (values) => {
  const { article, title, description, quantity, price, subcategoryId } = values;

  const formData = new FormData();
  formData.append("article", article);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("quantity", String(quantity));
  formData.append("price", String(price));
  formData.append("subcategoryId", String(subcategoryId));
  formData.append("slug", slugify(title));
  image && formData.append("image", image);
  formData.append("attributeValues", JSON.stringify(attributeValues));

  addProduct(formData);
  push("/admin/products");
};
```

#### Implementation Details
- Uses React Hook Form for form validation and submission.
- Handles file uploads for product images.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/eab5286e-2f38-4898-9bfb-6199e7ae134b)

### 4. Admin Banners

#### Description
The Admin Banners component allows administrators to manage banners displayed on the application's frontend. It provides functionality for adding, deleting, and viewing banners with pagination support.

#### Code Example (Banner List)
```jsx
// admin/banners/page.jsx

banners.rows.map((banner: string) => (
  <AdminBanner key={banner} deleteBanner={deleteBanner} bannerUrl={banner} />
))
```

#### Implementation Details
- Fetches banners data from the server.
- Supports adding and deleting banners.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/d547a2f3-16c7-41df-8500-5dc924fd830f)

### 5. Admin Products

#### Description
The Admin Products component provides a list of products for administrators to manage. It allows for easy navigation and editing of product details.

#### Code Example (Rendering Products)
```jsx
// admin/products/page.jsx

products.rows.map((product: Product) => (
  <AdminProduct key={product.id} {...product} />
))
```

#### Implementation Details
- Fetches product data from the server with pagination support.
- Supports searching and filtering products.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/aa635982-898e-420c-a316-9aa2e0d447e0)

### 6. Admin Subcategories

#### Description
The Admin Subcategories component enables administrators to manage subcategories within different product categories. It allows for the addition, deletion, and editing of subcategories.

#### Code Example (Rendering Subcategories)
```jsx
// admin/subcategories/page.jsx

subcategories.rows.map((subcategory: Subcategory) => (
  <AdminCategory
    key={subcategory.id}
    edit={editSubcategory}
    deleteItem={deleteSubcategory}
    imageFolder="subcategoriesImages"
    subcategoryParent={categories.find(
      (category) => category.id === subcategory.categoryId
    )}
    {...subcategory}
  />
))
```

#### Implementation Details
- Fetches subcategories data from the server.
- Provides functionality for adding, editing, and deleting subcategories.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/c29d3c46-d5ff-4154-bbe6-f04d1d184125)

### 7. Admin Layout

#### Description
The Admin Layout component provides a structured layout for the admin panel. It includes navigation links and a container for rendering different admin pages.

#### Code Example (Active Navigation)
```jsx
// admin/layout.jsx

const sections = [
		{ href: "products", name: "Товари" },
		{ href: "categories", name: "Категорії" },
		{ href: "subcategories", name: "Підкатегорії" },
		{ href: "banners", name: "Банери" },
		{ href: "attributes", name: "Атрибути" },
	];

sections.map((section, index) => (
  <Link key={section.href} href={`/admin/${section.href}`}>
    <section
      onClick={() => {
        dispatch(setActiveCategory(index));
      }}
      className={
        pathname[pathname.length - 1] === section.href ? styles.active : ""
      }>
      {section.name}
    </section>
  </Link>
))
```

#### Implementation Details
- Manages active navigation state for highlighting current page.
- Utilizes Redux for state management.

#### Screenshots

![image](https://github.com/danylo-gavrylovskyi/DomanFront/assets/118884527/b15c44d5-3438-4411-aadc-03542dac074a)
