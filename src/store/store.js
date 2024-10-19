import { configureStore } from "@reduxjs/toolkit";

import todosListReducer from "../features/demoRedux/redux/demoReduxSlice"

const store = configureStore({
    reducer: {
        todosList: todosListReducer
    }
})


export default store;
