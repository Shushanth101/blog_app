import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function CommentForm({ blogId, userId, onCommentPosted }) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:9000/blog/comment/${blogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
          createdBy: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post comment");
      }

      const newComment = await response.json();
      onCommentPosted(newComment); // Callback to update parent's state
      setCommentText(""); // Clear input
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err.message || "An error occurred while posting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      <Form.Group className="mb-3" controlId="formComment">
        <Form.Label>Leave a Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter your comment..."
          name="comment"
          value={commentText}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </Form.Group>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </Form>
  );
}

export default CommentForm;