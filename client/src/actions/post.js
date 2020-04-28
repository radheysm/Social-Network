import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
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

export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5001/api/post/like/${id}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{id, likes:res.data}
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// remove Like

export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5001/api/post/unlike/${id}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{id, likes:res.data}
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

// add post

export const addPost = formData => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post('http://localhost:5001/api/post', formData, config);
        dispatch({
            type:ADD_POST,
            payload:res.data
        });
         dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// Get Posts by ID

export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`http://localhost:5001/api/post/${id}`);
        dispatch({
            type:GET_POST,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// add comment

export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`http://localhost:5001/api/post/comment/${postId}`, formData, config);
        dispatch({
            type:ADD_COMMENT,
            payload:res.data
        });
         dispatch(setAlert('Comment Added', 'success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}

// delete comment

export const deleteComment = (postId,commentId) => async dispatch => {

    try {
        await axios.delete(`http://localhost:5001/api/post/comment/${postId}/${commentId}`);
        dispatch({
            type:REMOVE_COMMENT,
            payload:commentId
        });
         dispatch(setAlert('Comment Removed', 'danger'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
}