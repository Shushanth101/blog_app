import React from "react";
import ReactMarkdown from "react-markdown";

function BlogDisplay({ imageURL, title, body, createdBy }) {
  return (
    <div className="card shadow-sm border-0">
      <img
        src={imageURL}
        alt="Blog cover"
        className="card-img-top rounded"
        style={{ maxHeight: "450px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h2 className="card-title mb-4">{title}</h2>
        <div className="card-text">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
        <div className="mt-3">
          <h4>Author: {createdBy}</h4>
        </div>
      </div>
    </div>
  );
}

export default BlogDisplay;