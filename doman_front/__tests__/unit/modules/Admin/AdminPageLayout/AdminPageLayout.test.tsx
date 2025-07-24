import { render, screen, fireEvent, act } from "@testing-library/react";

import { AdminPageLayout } from "@/modules/Admin/AdminPageLayout/AdminPageLayout";

jest.mock("@/components/Pagination/Pagination", () => ({
    Pagination: () => <div data-testid="mock-pagination">Pagination</div>,
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: jest.fn(),
    }),
    usePathname: () => "",
    useSearchParams: () => new URLSearchParams(),
}));

describe("AdminPageLayout (Unit)", () => {
    const BUTTON_TEXTS = {
        CREATE: "Create New",
        SAVE: "Зберегти",
    } as const;
    const categoryLabel = "Категорія";

    const mockAdminPageProps = {
        isAdding: false,
        onSaveForm: jest.fn(),
        changeAddingMode: jest.fn(),
        createBtnText: BUTTON_TEXTS.CREATE,
        page: "1",
        perPage: "10",
        elementsCount: 25,
        children: <div data-testid="test-content">Test Content</div>,
    };
    const mockCategories = [
        { id: 1, title: "Category 1", slug: "category-1", image: "image1.jpg" },
        { id: 2, title: "Category 2", slug: "category-2", image: "image2.jpg" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Basic rendering", () => {
        it("renders create button when not in adding mode", () => {
            render(<AdminPageLayout {...mockAdminPageProps} />);

            const createButton = screen.getByText(BUTTON_TEXTS.CREATE);
            const saveButton = screen.getByText(BUTTON_TEXTS.SAVE);

            expect(createButton).toBeInTheDocument();
            expect(createButton).toHaveStyle({ display: "block" });
            expect(saveButton).toHaveStyle({ display: "none" });
            expect(screen.getByTestId("mock-pagination")).toBeInTheDocument();
        });

        it("renders save button when in adding mode", () => {
            render(<AdminPageLayout {...mockAdminPageProps} isAdding={true} />);

            const createButton = screen.getByText(BUTTON_TEXTS.CREATE);
            const saveButton = screen.getByText(BUTTON_TEXTS.SAVE);

            expect(saveButton).toBeInTheDocument();
            expect(saveButton).toHaveStyle({ display: "block" });
            expect(createButton).toHaveStyle({ display: "none" });
            expect(screen.getByTestId("mock-pagination")).toBeInTheDocument();
        });

        it("renders children content", () => {
            render(<AdminPageLayout {...mockAdminPageProps} />);

            expect(screen.getByTestId("test-content")).toBeInTheDocument();
            expect(screen.getByTestId("mock-pagination")).toBeInTheDocument();
        });
    });

    describe("Form inputs", () => {
        it("renders title input when isInputNeeded is true", () => {
            const inputText = "Enter title";
            render(<AdminPageLayout {...mockAdminPageProps} isAdding={true} isInputNeeded={true} inputText={inputText} />);

            const input = screen.getByPlaceholderText(inputText);
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute("name", "title");
        });

        it("renders category select when isSelectNeeded is true", () => {
            render(
                <AdminPageLayout
                    {...mockAdminPageProps}
                    isAdding={true}
                    isSelectNeeded={true}
                    categories={mockCategories}
                />
            );

            const selectLabel = screen.getByLabelText(categoryLabel);
            expect(selectLabel).toBeInTheDocument();

            // Open the select dropdown
            act(() => {
                fireEvent.mouseDown(selectLabel);
            });

            // Check if category options are rendered
            mockCategories.forEach(category => {
                expect(screen.getByText(category.title)).toBeInTheDocument();
            });
        });

        it("renders image input when isImageInputNeeded is true", () => {
            const insertImgText = "Insert image";
            render(
                <AdminPageLayout
                    {...mockAdminPageProps}
                    isAdding={true}
                    isImageInputNeeded={true}
                    insertImgText={insertImgText}
                />
            );

            const label = screen.getByText(insertImgText);
            expect(label).toBeInTheDocument();
            expect(screen.getByLabelText(insertImgText)).toHaveAttribute("type", "file");
            expect(screen.getByLabelText(insertImgText)).toHaveAttribute("name", "image");
        });
    });

    describe("Form interactions", () => {
        it("calls changeAddingMode when create button is clicked", () => {
            render(<AdminPageLayout {...mockAdminPageProps} />);

            act(() => {
                fireEvent.click(screen.getByText(BUTTON_TEXTS.CREATE));
            });

            expect(mockAdminPageProps.changeAddingMode).toHaveBeenCalledTimes(1);
        });

        it("calls onSaveForm when form is submitted", () => {
            render(<AdminPageLayout {...mockAdminPageProps} isAdding={true} />);

            const form = screen.getByRole("form", { name: /admin form/i });
            act(() => {
                fireEvent.submit(form);
            });

            expect(mockAdminPageProps.onSaveForm).toHaveBeenCalledTimes(1);
        });
    });
}); 