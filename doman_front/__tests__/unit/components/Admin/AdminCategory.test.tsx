import { render, screen, fireEvent, act } from "@testing-library/react";

import { AdminCategory } from "@/components/Admin/AdminCategory/AdminCategory";

import { mockCategory, mockSubcategory } from "@/__tests__/mocks/category";

describe("AdminCategory (Unit)", () => {
    const BUTTON_TEXTS = {
        EDIT: "Змінити",
        DELETE: "Видалити",
        SAVE: "Зберегти",
    } as const;
    const placeholderText = "Введіть нову назву";
    const labelText = "Нова обкладинка";

    const mockAdminCategoryProps = {
        ...mockCategory,
        edit: jest.fn(),
        deleteItem: jest.fn(),
    };
    const mockSubcategoryProps = {
        ...mockSubcategory,
        subcategoryParent: {
            id: 2,
            title: "Parent Category",
            slug: "parent-category",
            image: "parent-image.jpg",
        },
        edit: jest.fn(),
        deleteItem: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = "http://test-api";
    });

    describe("Category rendering", () => {
        it("renders category with correct image URL", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            const image = screen.getByRole("img");
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute("src", `${process.env.NEXT_PUBLIC_API_URL}/uploads/categoriesImages/${mockAdminCategoryProps.image}`);
        });

        it("renders category title", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            expect(screen.getByText(mockAdminCategoryProps.title)).toBeInTheDocument();
        });

        it("renders edit and delete buttons", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            expect(screen.getByText(BUTTON_TEXTS.EDIT)).toBeInTheDocument();
            expect(screen.getByText(BUTTON_TEXTS.DELETE)).toBeInTheDocument();
        });
    });

    describe("Subcategory rendering", () => {
        it("renders subcategory with parent category title", () => {
            render(<AdminCategory {...mockSubcategoryProps} />);

            expect(screen.getByText(`${mockSubcategoryProps.title} (${mockSubcategoryProps.subcategoryParent.title})`)).toBeInTheDocument();
        });

        it("renders subcategory with correct image URL", () => {
            render(<AdminCategory {...mockSubcategoryProps} />);

            const image = screen.getByRole("img");
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute("src", `${process.env.NEXT_PUBLIC_API_URL}/uploads/subcategoriesImages/${mockSubcategoryProps.image}`);
        });
    });

    describe("Edit mode", () => {
        it("shows edit form when edit button is clicked", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            act(() => {
                fireEvent.click(screen.getByText(BUTTON_TEXTS.EDIT));
            });

            expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
            expect(screen.getByText(labelText)).toBeInTheDocument();
            expect(screen.getByText(BUTTON_TEXTS.SAVE)).toBeInTheDocument();
        });

        it("hides image and title when in edit mode", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            act(() => {
                fireEvent.click(screen.getByText(BUTTON_TEXTS.EDIT));
            });

            expect(screen.queryByRole("img")).not.toBeInTheDocument();
            const titleElement = screen.getByText(mockAdminCategoryProps.title);
            expect(titleElement).toHaveStyle({ display: "none" });
        });

        it("submits form with new title and image", async () => {
            const formLabel = "Edit category form";

            render(<AdminCategory {...mockAdminCategoryProps} />);

            // Enter edit mode
            act(() => {
                fireEvent.click(screen.getByText(BUTTON_TEXTS.EDIT));
            });

            // Fill in new title
            const titleInput = screen.getByPlaceholderText(placeholderText);
            act(() => {
                fireEvent.change(titleInput, { target: { value: "New Title" } });
            });

            // Upload new image
            const file = new File(["test"], "test.png", { type: "image/png" });
            const imageInput = screen.getByLabelText(labelText);
            act(() => {
                fireEvent.change(imageInput, { target: { files: [file] } });
            });

            // Submit form
            const form = screen.getByRole("form", { name: formLabel });
            await act(async () => {
                fireEvent.submit(form);
            });

            // Wait for the next tick to allow state updates to complete
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(mockAdminCategoryProps.edit).toHaveBeenCalledWith({
                id: mockAdminCategoryProps.id,
                formData: expect.any(FormData),
            });
        });
    });

    describe("Delete functionality", () => {
        it("calls deleteItem with correct id when delete button is clicked", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            act(() => {
                fireEvent.click(screen.getByText(BUTTON_TEXTS.DELETE));
            });

            expect(mockAdminCategoryProps.deleteItem).toHaveBeenCalledTimes(1);
            expect(mockAdminCategoryProps.deleteItem).toHaveBeenCalledWith(mockAdminCategoryProps.id);
        });
    });
}); 