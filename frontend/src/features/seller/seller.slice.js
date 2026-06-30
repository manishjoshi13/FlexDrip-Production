import { createSlice} from "@reduxjs/toolkit"

let sellerSlice=createSlice({
    name:"seller",
    initialState:{
        myProducts:[],
        isLoading:false,
        error:null,
    },
    reducers:{
        setLoading:(state,action)=>{
            state.isLoading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setMyProducts:(state,action)=>{
            state.myProducts=action.payload;
        }
    }
})

export const {setLoading,setError,setMyProducts}=sellerSlice.actions
export default sellerSlice.reducer