import React, { Component} from 'react';
// import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
// import {addPost} from '../../actions/post';
const axios = require('axios');


class PostForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      text:'',
      file:null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onFormSubmit(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('text',this.state.text);
    formData.append('postImage', this.state.file);
    const config = {
      headers:{
        'Content-type':'multipart/form-data'
      }
    };
    axios.post('http://localhost:5001/api/post', formData, config)
         .then((response) =>{
           alert("Post added successfully");
         }).catch((error) =>{

         });
  }
  onChange(e){
    this.setState({file:e.target.files[0]});

  }
  render() {
       return (
        <div className="post-form">
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1" onSubmit = {this.onFormSubmit} encType="multipart/form-data">
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            onChange = {e=>this.setState({text:e.target.value})}
          ></textarea>
          <input type="file"
           name = "postImage"
           onChange = {this.onChange}
           />
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
    )
    }
}



export default PostForm;


// import React,{useState} from 'react'
// import PropTypes from 'prop-types'
// import {connect} from 'react-redux';
// import {addPost} from '../../actions/post';


// const PostForm = ({addPost}) => {
//     const [formData, setFormData] = useState({
//       text:'',
//       postImage:null
//     });
//     const {text,postImage} = formData;
   
//     // const onChange = e => setFormData({...formData, [e.target.name]:e.target.value});

//     const onSubmit = e => {
//       e.preventDefault();
//       const formData = new FormData();
//       addPost(formData);
//       setFormData('');
//     };
   



