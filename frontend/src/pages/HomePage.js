import React from 'react';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import './HomePage.scss';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="container">
        <header className="page-header">
          <h1>Welcome to the Comment System</h1>
          <p>Share your thoughts and engage with the community</p>
        </header>

        <section className="comment-section">
          <CommentForm />
          <CommentList />
        </section>
      </div>
    </div>
  );
};

export default HomePage;

