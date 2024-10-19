import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const TODO_API = "https://jsonplaceholder.typicode.com/todos/";

const initialState = {
  data: [],
  isFetching: false,
  error: null,
};

export const fetchTodos = createAsyncThunk(
  "todo/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(TODO_API);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const todosListSlice = createSlice({
  name: "todosList",
  initialState,
  reducers: {
    clearTodosError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchTodos.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      }),
});

export const { clearTodosError } = todosListSlice.actions;

export const getTodosListData = (state) => state.todosList.data;
export const getTodoListFetching = (state) => state.todosList.isFetching;
export const getTodoListError = (state) => state.todosList.error;

export default todosListSlice.reducer;
