import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST
} from './types';


// Get Posts

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:5001/api/post');
        dispatch({
            type:GET_POSTS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// Add Like

export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5001/api/post/like/${postId}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{postId, likes:res.data}
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// remove Like

export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5001/api/post/unlike/${postId}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{postId, likes:res.data}
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// delete post

export const deletePost = postId => async dispatch => {
    try {
        await axios.delete(`http://localhost:5001/api/post/${postId}`);
        dispatch({
            type:DELETE_POST,
            payload:postId
        });
         dispatch(setAlert('Post Removed', 'success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}