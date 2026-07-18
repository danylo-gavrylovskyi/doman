import { render, screen, fireEvent } from "@testing-library/react";

import { AdminCategory } from "@/components/Admin/AdminCategory/AdminCategory";

import { mockCategory, mockSubcategory } from "@/__tests__/mocks/category";

describe("AdminCategory (Unit)", () => {
    const BUTTON_TEXTS = {
        EDIT: "Змінити",
        DELETE: "Видалити",
    } as const;

    const mockAdminCategoryProps = {
        ...mockCategory,
        linkToUpdatePage: "/admin/categories/1",
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
        linkToUpdatePage: "/admin/subcategories/1",
        deleteItem: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = "http://test-api";
    });

    describe("Category rendering", () => {
        it("renders category image with the title as alt text", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            const image = screen.getByRole("img");
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute("alt", mockAdminCategoryProps.title);
        });

        it("renders category title", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            expect(screen.getByText(mockAdminCategoryProps.title)).toBeInTheDocument();
        });

        it("renders edit link pointing to the update page", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            expect(screen.getByText(BUTTON_TEXTS.EDIT).closest("a")).toHaveAttribute(
                "href",
                mockAdminCategoryProps.linkToUpdatePage
            );
        });

        it("renders delete button", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            expect(screen.getByText(BUTTON_TEXTS.DELETE)).toBeInTheDocument();
        });
    });

    describe("Subcategory rendering", () => {
        it("renders subcategory with parent category title", () => {
            render(<AdminCategory {...mockSubcategoryProps} />);

            expect(
                screen.getByText(`${mockSubcategoryProps.title} (${mockSubcategoryProps.subcategoryParent.title})`)
            ).toBeInTheDocument();
        });
    });

    describe("Delete functionality", () => {
        it("calls deleteItem with correct id when delete button is clicked", () => {
            render(<AdminCategory {...mockAdminCategoryProps} />);

            fireEvent.click(screen.getByText(BUTTON_TEXTS.DELETE));

            expect(mockAdminCategoryProps.deleteItem).toHaveBeenCalledTimes(1);
            expect(mockAdminCategoryProps.deleteItem).toHaveBeenCalledWith(mockAdminCategoryProps.id);
        });
    });
});
