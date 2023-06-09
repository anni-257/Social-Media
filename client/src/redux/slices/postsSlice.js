import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";


export const getUserProfile= createAsyncThunk("user/getUserProfile", async (body,thunkAPI)=>{
    try {
        console.log("calling getUserProfile API from PostSlice")
        thunkAPI.dispatch(setLoading(true));
        const response=await axiosClient.post('/user/getUserProfile',body)
        console.log("geetUserProfile Response: ",response.result);
        return response.result;
    } catch (e) {
        return Promise.reject(e);
    }finally{
        thunkAPI.dispatch(setLoading(false));
    }
})

export const likeAndUnlikePost=createAsyncThunk("post/likeAndUnlike",async(body,thunkAPI)=>{
    try {
        thunkAPI.dispatch(setLoading(true));
        const response=await axiosClient.post('posts/like',body);
        console.log("likeAndUnlike: ",response.result);
        return response.result.post;

    } catch (error) {
        return Promise.reject(error);
    } finally{
        thunkAPI.dispatch(setLoading(false));
    }
})

const postSlice= createSlice({
    name:"postSlice",
    initialState:{
        userProfile:{}
    },
    extraReducers:(builder)=>{
        builder.addCase(getUserProfile.fulfilled, (state,action)=>{
            console.log("inside addCase")
            state.userProfile=action.payload
        })

        .addCase(likeAndUnlikePost.fulfilled,(state,action)=>{
            const post =action.payload;
            const index=state?.userProfile?.posts?.findIndex(item => item._id === post._id)
            if(index != undefined && index!== -1){
                state.userProfile.posts[index]= post;
            }
        })
        
    }

})

export default postSlice.reducer;
