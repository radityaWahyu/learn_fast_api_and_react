import { createSlice }  from "@reduxjs/toolkit"

const snackbarSlice = createSlice({
    name:"snackbar",
    initialState:{
        show: false,
        message:"message default",
        type:"info"
    },
    reducers:{
        closeSnackbar: (state) =>{
            state.show = false
            state.message = "default message"
        },
        showSnackbar: (state, action) => {
            state.show = action.payload.show
            state.message = action.payload.message
            state.type = action.payload.type
        },
        
    }
})

export const {showSnackbar, closeSnackbar} = snackbarSlice.actions
export default snackbarSlice.reducer