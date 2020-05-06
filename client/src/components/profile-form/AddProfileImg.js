import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
const axios = require('axios');



export default class AddProfileImg extends Component {
  constructor(props){
    super(props);
    this.state = {
      file:null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onFormSubmit(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('profileImage', this.state.file);
    const config = {
      headers:{
        'Content-type':'multipart/form-data'
      }
    };
    axios.post('http://localhost:5001/api/profile/img', formData, config)
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
      <Fragment>
             <h1 className="large text-primary">
        Upload Profile Image
      </h1>
       <p className="lead">
         <i className="fas fa-code-branch"></i> Add A beautiful Snippet of yours
       </p>
       <small>* = required field</small>
       <form className="form" onSubmit = {this.onFormSubmit}>
         <div className="form-group">
           <input type="file" name="profileImage" onChange = {this.onChange}/>
         </div>
         <input type="submit" className="btn btn-primary my-1" />
         <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
       </form>
     </Fragment>
    )
  }
}


// import React, { Fragment, useState } from 'react';
// import {Link, withRouter} from 'react-router-dom';
// import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
// import {addProfileImg} from '../../actions/profile';

// const AddProfileImg = () => {


//     const fileSelectedHandler = event =>{
        
//     }
//     return (
//         <Fragment>
//             <h1 className="large text-primary">
//        Upload Profile Image
//       </h1>
//       <p className="lead">
//         <i className="fas fa-code-branch"></i> Add A beautiful Snippet of yours
//       </p>
//       <small>* = required field</small>
//       <form className="form">
//         <div className="form-group">
//           <input type="file" onChange = {e=>fileSelectedHandler(e)}/>
//         </div>
//         <input type="submit" className="btn btn-primary my-1" />
//         <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
//       </form>
//         </Fragment>
//     )
// }

// AddProfileImg.propTypes = {
     
// }

// export default AddProfileImg;
