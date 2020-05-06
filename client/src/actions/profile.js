import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    DELETE_ACCOUNT,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_REPOS
} from './types';

// Get Current users profile

export const getCurrentProfile = () => async dispatch =>{

    try {
        const res = await axios.get('http://localhost:5001/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (err) {

        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
};

// GET all profiles

export const getProfiles = () => async dispatch =>{
    dispatch({type:CLEAR_PROFILE});
    try {
        const res = await axios.get('http://localhost:5001/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
};

//GET profile by Id

export const getProfileById = userId => async dispatch =>{
    try {
        const res = await axios.get(`http://localhost:5001/api/profile/user/${userId}`);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
};

//GET Github Repos

export const getGithubRepos = username => async dispatch =>{
    try {
        const res = await axios.get(`http://localhost:5001/api/profile/github/${username}`);
        dispatch({
            type:GET_REPOS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
};

// Create or Update profile 

export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {

        const config = {
            headers:{
                'Content-type':'application/json'
            }
        }
        // const body = JSON.stringify(formData);
        const res = await axios.post('http://localhost:5001/api/profile',formData, config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
        // console.log("Hello");
        dispatch(setAlert(edit? 'Profile Updated' : 'Profile Created','success'));
        if(!edit){
            // console.log("There");
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}

        });
    }
};


// Add Experience

export const addExperience = (formData, history) => async dispatch =>{

    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        };
        const res = await axios.put('http://localhost:5001/api/profile/experience', formData, config);
        
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Experience Added', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        });
        
    }

};

// Add Education

export const addEducation = (formData, history) => async dispatch =>{

    try {
        const config = {
            header:{
                'Content-Type':'application/json'
            }
        };

        const res = await axios.put('http://localhost:5001/api/profile/education', formData, config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Education Added', 'success'));
        history.push('/dashboard');


    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => setAlert(error.msg,'danger'));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        });
    }
};



// Delete experience

export const deleteExperience = id => async dispatch => {

    try {
        const res = await axios.delete(`http://localhost:5001/api/profile/experience/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Experience Removed', 'danger'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        });
    }

};

// Delete education

export const deleteEducation = id => async dispatch => {

    try {
        const res = await axios.delete(`http://localhost:5001/api/profile/education/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Education Removed', 'danger'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        });
    }

};


// Delete account & profile

export const deleteAccount = () => async dispatch => {

   if(window.confirm('Are you sure? This can NOT be undone!!'))
   {
    try {
        await axios.delete('http://localhost:5001/api/profile');
        dispatch({
            type:CLEAR_PROFILE,
        });
        dispatch({
            type:DELETE_ACCOUNT
        });
        dispatch(setAlert('Your account has been permanantly deleted'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        });
    }

   }
};
