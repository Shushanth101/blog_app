import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function AddBlog() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    coverImage: null, 
  });

 useEffect(() => {
  const tokenFromCookie = Cookies.get('token');

  if (!tokenFromCookie) {
    window.location.href = "/user/signin";
    return;
  }

  
  setToken(tokenFromCookie);

  fetch('http://localhost:9000/validate/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: tokenFromCookie }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.error || !data._id) {
        Cookies.remove('token');
        window.location.href = "/user/signin";
      } else {
        setUser(data);
      }
    })
    .catch((err) => {
      console.error('Validation error:', err);
      Cookies.remove('token');
      window.location.href = "/user/signin";
    });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({
      ...prev,
      coverImage: e.target.files[0]
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (!form.title || !form.body || !form.coverImage) {
    console.error("All fields are required.");
    return;
  }

  const blogData = new FormData();
  blogData.append("title", form.title);
  blogData.append("body", form.body);
  blogData.append("coverImage", form.coverImage); // must match backend field name

  fetch("http://localhost:9000/blog", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: blogData, // no need to set 'Content-Type' — browser sets it automatically with boundary
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to upload blog.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Blog added:", data);
      window.location.href = `/blog/${data.blogId}`;
    })
    .catch((err) => {
      console.error("Blog upload error:", err);
      alert("Failed to create blog. Please try again.");
    });
};


  if (!user) return null;

  return (
    <Form className="p-4" onSubmit={handleSubmit}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Choose Cover Image</Form.Label>
        <Form.Control type="file" name="coverImage" onChange={handleFileChange} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter blog title"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBody">
        <Form.Label>Body</Form.Label>
        <Form.Control
          as="textarea"
          name="body"
          rows={6}
          value={form.body}
          onChange={handleChange}
          placeholder="Write your blog here..."
        />
      </Form.Group>

      <Button type="submit" variant="primary">Submit Blog</Button>
    </Form>
  );
}

export default AddBlog;
