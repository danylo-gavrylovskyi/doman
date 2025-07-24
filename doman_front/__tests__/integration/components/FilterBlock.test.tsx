import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent } from "@testing-library/react";

import filterReducer from "@/redux/features/filterSlice";

import { FilterBlock } from "@/components/FilterBlock/FilterBlock";

describe("FilterBlock (Integration)", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: { filter: filterReducer },
            preloadedState: {
                filter: {
                    checkedAttributes: ["Value 1"]
                }
            }
        });
    })

    it("renders checked attributes from state", () => {
        render(
            <Provider store={store}>
                <FilterBlock attributeName="Test Attribute" attributeValues={["Value 1"]} />
            </Provider>
        )

        expect(screen.getByLabelText("Value 1")).toBeChecked()
    });

    it("removes checked attribute from Redux state when toggled", () => {
        render(
            <Provider store={store}>
                <FilterBlock attributeName="Test Attribute" attributeValues={["Value 1"]} />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText("Value 1"));

        expect(store.getState().filter.checkedAttributes).not.toContain("Value 1");
        expect(screen.getByLabelText("Value 1")).not.toBeChecked()
    });

    it("updates Redux state when attribute checked", () => {
        render(
            <Provider store={store}>
                <FilterBlock attributeName="Test Attribute" attributeValues={["Value 1", "Value 2"]} />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText("Value 2"))

        expect(store.getState().filter.checkedAttributes).toContain("Value 2")
        expect(screen.getByLabelText("Value 2")).toBeChecked()
    })
});
