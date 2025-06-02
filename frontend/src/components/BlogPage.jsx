// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import Cookies from "js-cookie";
// import { Form, Button } from "react-bootstrap";

// function BlogPage() {
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [form, setForm] = useState({ comment: "" });
//   const { blogId } = useParams();
//   const [imageURL, setImageURL] = useState(
//     "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
//   );
//   const [title, setTitle] = useState("Loading...");
//   const [body, setBody] = useState("Please wait while we fetch your blog...");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [createdBy,setCreatedBy] = useState("")

//   useEffect(() => {
//     async function fetchBlogPostById(id) {
//       try {
//         const response = await fetch(`http://localhost:9000/blog/${id}`);
//         if (!response.ok) throw new Error("Failed to fetch blog");
//         const data = await response.json();

//         if (!data.blog) {
//           throw new Error("Blog data is missing from response");
//         }

//         setImageURL(data.blog.coverImageURL || imageURL);
//         setTitle(data.blog.title || "Untitled Blog");
//         setBody(data.blog.body || "No content available.");
//         setCreatedBy(data.blog.createdBy.fullName)
//         setComments(data.comments || []);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || "Unable to fetch blog post.");
//         setLoading(false);
//         console.error("Fetch error:", err);
//       }
//     }

//     const tokenFromCookie = Cookies.get("token");
//     if (tokenFromCookie) {
//       setToken(tokenFromCookie);
//     }

//     fetchBlogPostById(blogId);
//   }, [blogId]);

//   useEffect(() => {
//     if (!token) return;

//     fetch("http://localhost:9000/validate/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token: token }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && !data.error && data._id) {
//           setUser(data);
//         }
//       })
//       .catch((err) => console.error(err));
//   }, [token]);

//   function handleSubmit(e) {
//     e.preventDefault();

//     const newForm = { ...form, userId: user._id };
//     setForm(newForm);

//     fetch(`http://localhost:9000/blog/comment/${blogId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         content: newForm.comment,
//         createdBy: newForm.userId,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Comment posted:", data);
//         setComments((prev) => [...prev, data]); // append new comment to UI
//         setForm({ comment: "" }); // clear input
//       })
//       .catch((err) => {
//         console.error("Error posting comment:", err);
//       });
//   }

//   function handleChange(e) {
//     setForm({ ...form, comment: e.target.value });
//   }

//   if (loading) return <p>Loading blog...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div className="container py-4">
//       <div className="card shadow-sm border-0">
//         <img
//           src={imageURL}
//           alt="Blog cover"
//           className="card-img-top rounded"
//           style={{ maxHeight: "450px", objectFit: "cover" }}
//         />
//         <div className="card-body">
//           <h2 className="card-title mb-4">{title}</h2>
//           <div className="card-text">
//             <ReactMarkdown>{body}</ReactMarkdown>
//           </div>

//           <div className="mt-5">
//             <h2>Author : {createdBy}</h2>
//             <h4>Comments ({comments.length})</h4>
//             {user && (
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3" controlId="formComment">
//                   <Form.Label>Comment</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter your comment..."
//                     name="comment"
//                     value={form.comment}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" className="w-100">
//                   Post Comment
//                 </Button>
//               </Form>
//             )}

//             {comments.length === 0 ? (
//               <p>No comments yet.</p>
//             ) : (
//               <ul className="list-group mt-3">
//                 {comments.map((comment) => (
//                   <li key={comment._id} className="list-group-item">
//                     <strong>
//                       {comment.createdBy?.fullName || "Anonymous"}
//                     </strong>
//                     <p>{comment.content || comment.text || comment.body}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BlogPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import BlogDisplay from "./BlogDisplay"; // Import the new component
import CommentList from "./CommentList";   // Import the new component
import CommentForm from "./CommentForm";   // Import the new component

function BlogPage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const { blogId } = useParams();
  const [blogData, setBlogData] = useState({
    imageURL: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
    title: "Loading...",
    body: "Please wait while we fetch your blog...",
    createdBy: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchBlogPostById(id) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:9000/blog/${id}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();

        if (!data.blog) {
          throw new Error("Blog data is missing from response");
        }

        setBlogData({
          imageURL: data.blog.coverImageURL || blogData.imageURL,
          title: data.blog.title || "Untitled Blog",
          body: data.blog.body || "No content available.",
          createdBy: data.blog.createdBy?.fullName || "Unknown Author",
        });
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message || "Unable to fetch blog post.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    const tokenFromCookie = Cookies.get("token");
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
    }

    fetchBlogPostById(blogId);
  }, [blogId]); 

  useEffect(() => {
    if (!token) {
      setUser(null); 
      return;
    }

    fetch("http://localhost:9000/validate/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error && data._id) {
          setUser(data);
        } else {
          setUser(null); // Clear user if token is invalid
          // Optionally, remove the invalid token cookie
          // Cookies.remove("token");
          // setToken(null);
        }
      })
      .catch((err) => {
        console.error("Token validation error:", err);
        setUser(null);
      });
  }, [token]);

  const handleCommentPosted = (newComment) => {
    // Assuming the newComment object from the API includes createdBy details
    // or that the backend populates it correctly.
    // If the backend returns the full comment object with populated user info:
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container py-4">
      <BlogDisplay
        imageURL={blogData.imageURL}
        title={blogData.title}
        body={blogData.body}
        createdBy={blogData.createdBy}
      />

      <div className="mt-5">
        <h4>Comments ({comments.length})</h4>
        <CommentList comments={comments} />
        {user && user._id ? (
          <CommentForm
            blogId={blogId}
            userId={user._id}
            onCommentPosted={handleCommentPosted}
          />
        ) : (
          <p className="mt-3">Please log in to post a comment.</p>
        )}
      </div>
    </div>
  );
}

export default BlogPage;

