import React from "react";

function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <ul className="list-group mt-3">
      {comments.map((comment) => (
        <li key={comment._id} className="list-group-item">
          <strong>
            {comment.createdBy?.fullName || "Anonymous"}
          </strong>
          <p>{comment.content || comment.text || comment.body}</p>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;