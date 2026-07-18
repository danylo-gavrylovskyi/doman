import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent } from "@testing-library/react";

import filterReducer from "@/redux/features/filterSlice";

import { FilterBlock } from "@/components/FilterBlock/FilterBlock";

const ATTRIBUTE_NAME = "Test Attribute";

const makeStore = () =>
    configureStore({
        reducer: { filter: filterReducer },
        preloadedState: {
            filter: {
                isOpened: false,
                checkedAttributes: [{ title: ATTRIBUTE_NAME, values: ["Value 1"] }],
            },
        },
    });

const getCheckedValues = (store: ReturnType<typeof makeStore>) =>
    store.getState().filter.checkedAttributes.find((attr) => attr.title === ATTRIBUTE_NAME)?.values ?? [];

describe("FilterBlock (Integration)", () => {
    let store: ReturnType<typeof makeStore>;

    beforeEach(() => {
        store = makeStore();
    })

    it("renders checked attributes from state", () => {
        render(
            <Provider store={store}>
                <FilterBlock attributeName={ATTRIBUTE_NAME} attributeValues={["Value 1"]} />
            </Provider>
        )

        expect(screen.getByLabelText("Value 1")).toBeChecked()
    });

    it("removes checked attribute from Redux state when toggled", () => {
        render(
            <Provider store={store}>
                <FilterBlock attributeName={ATTRIBUTE_NAME} attributeValues={["Value 1"]} />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText("Value 1"));

        expect(getCheckedValues(store)).not.toContain("Value 1");
        expect(screen.getByLabelText("Value 1")).not.toBeChecked()
    });

    it("updates Redux state when attribute checked", () => {
        render(
            <Provider store={store}>
                <FilterBlock attributeName={ATTRIBUTE_NAME} attributeValues={["Value 1", "Value 2"]} />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText("Value 2"))

        expect(getCheckedValues(store)).toContain("Value 2")
        expect(screen.getByLabelText("Value 2")).toBeChecked()
    })
});
