import React, {Fragment,useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getPosts} from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import {getCurrentProfile} from '../../actions/profile';

const Posts = ({post:{posts,loading}, profile:{profile}, getPosts,getCurrentProfile}) => {
    useEffect(() =>{
        getPosts();
        getCurrentProfile();
    },[getPosts,getCurrentProfile]);
    return loading ? <Spinner/> : (<Fragment>

        <h1 className="large text-primary">
            Posts
        </h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome to the community
        </p>
        {/* PostForm */}
        <PostForm/>
        <div className="posts">
            {posts.map(post => (
                <PostItem key = {post._id} post = {post} profile={profile}/>
            ))}
        </div>
        {/* <h1 className="large text-primary">
            Posts
        </h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome to the community
        </p>
        <PostForm/>
        <div className="posts">
            {posts.map(post => (
                <PostItem key = {post._id} post = {post}/>
            ))}
        </div> */}
    </Fragment>
    );
};

Posts.propTypes = {
    getPosts:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired,
    getCurrentProfile:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    post:state.post,
    profile:state.profile
});

export default connect(mapStateToProps, {getPosts,getCurrentProfile})(Posts);
