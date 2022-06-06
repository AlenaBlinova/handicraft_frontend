import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

export const getCategory = createAsyncThunk(
    'category/info',
    async ({categoryId}, thunkAPI) => {
        try {
            const response = await axios.get(BASE_API_URL + "/categories/" + categoryId)
            const {data} = response
            if (response.status === 200) {
                return {...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const createToy = createAsyncThunk(
    'toys/create',
    async ({payload}, thunkAPI) => {
        try {
            const response = await axios.post(BASE_API_URL + "/toys", payload, {
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

export const updateToy = createAsyncThunk(
    'toys/update',
    async ({id, payload}, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_API_URL + "/toys/" + id, payload,{
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
export const deleteToy = createAsyncThunk(
    'toys/delete',
    async ({id}, thunkAPI) => {
        try {
            const response = await axios.delete(BASE_API_URL + "/toys/" + id,{
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

const initialState = () => ({
    title: "",
    thumbnailId: null,
    toys: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
})


export const categorySlice = createSlice({
    name: 'category',
    initialState: initialState(),
    extraReducers: {
        [createToy.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [createToy.pending]: (state) => {
            state.isSuccess = false
            state.isFetching = true
        },
        [createToy.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            state.toys.push(payload)
        },

        [deleteToy.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [deleteToy.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            const candidate = state.toys.find(i => i.id === payload.id)
            const indexOf = state.toys.indexOf(candidate)
            if (indexOf > -1) {
                state.toys.splice(indexOf, 1)
            }
        },
        [deleteToy.pending]: (state) => {
            state.isSuccess = false
            state.isFetching = true
        },

        [updateToy.pending]: (state) => {
            state.isSuccess = false
            state.isFetching = true;
        },
        [updateToy.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;

            const candidate = state.toys.find(i => i.id === payload.id)
            const indexOf = state.toys.indexOf(candidate)
            if (indexOf > -1) {
                state.toys[indexOf] = payload
            }
        },
        [updateToy.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [getCategory.pending]: (state) => {
            const newState = initialState()
            return {
                ...newState,
                isFetching: true,
                isSuccess: false
            }
        },
        [getCategory.fulfilled]: (state, {payload}) => {
            state.title = payload.title
            state.toys = payload.toys
            state.thumbnailId = payload.thumbnailId
            state.isFetching = false;
            state.isSuccess = true;
        },
        [getCategory.rejected]: () => {}
    }
})

export const toysSelector = (state) => state.category.toys