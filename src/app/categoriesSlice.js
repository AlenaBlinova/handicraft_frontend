import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

export const createCategory = createAsyncThunk(
    'categories/create',
    async ({payload}, thunkAPI) => {
        try {
            const response = await axios.post(BASE_API_URL + "/categories/", payload, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {...payload, ...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const getCategories = createAsyncThunk(
    'categories/all',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.get(BASE_API_URL + "/categories/")
            const {data} = response
            if (response.status === 200) {
                return [...data];
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({id, payload}, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_API_URL + "/categories/" + id, payload,{
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {...payload, ...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async ({id}, thunkAPI) => {
        try {
            const response = await axios.delete(BASE_API_URL + "/categories/" + id,{
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {id, ...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        isFetching: false,
        isSuccess: false,
        isError: false,
    },
    extraReducers: {
        [createCategory.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            state.items.push(payload)
        },
        [createCategory.pending]: (state) => {
            state.isFetching = true
        },
        [createCategory.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [deleteCategory.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [deleteCategory.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            const candidate = state.items.find(i => i.id === payload.id)
            const indexOf = state.items.indexOf(candidate)
            if (indexOf > -1) {
                state.items.splice(indexOf, 1)
            }
        },
        [deleteCategory.pending]: (state) => {
            state.isFetching = true
        },

        [updateCategory.pending]: (state) => {
            state.isFetching = true;
        },
        [updateCategory.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;

            const candidate = state.items.find(i => i.id === payload.id)
            const indexOf = state.items.indexOf(candidate)
            if (indexOf > -1) {
                state.items[indexOf] = payload
            }
            // state.items[state.items.indexOf(state.items.find(i => i.id === payload.id))] = payload
        },
        [updateCategory.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [getCategories.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.items = payload
        },
        [getCategories.pending]: (state) => {
            state.isFetching = true;
        },
        [getCategories.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
    }
})

export const categoriesSelector = (state) => state.categories.items