import { useState,useEffect } from "react";
import Navbar from "./components/NavBar";
import BlogCard from "./components/BlogCard";
import { Container, Row, Col } from 'react-bootstrap';

function Home() {
  const [blogPosts,setBlogPosts] = useState([])

 useEffect(() => {
    async function fetchAllPosts() {
      try {
        const response = await fetch("http://localhost:9000/all-posts", { method: 'GET' });
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setBlogPosts(data.blogPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      }
    }
    fetchAllPosts();
  }, []);

  return (
  <>
    <Navbar />
    {blogPosts && blogPosts.length > 0 ? (
      <Container>
        <Row>
          {blogPosts.map(blogPost => (
            <Col key={blogPost._id} md={3} className="mb-4">
              <BlogCard
                image={blogPost.coverImageURL}
                title={blogPost.title}
                body={blogPost.body}
                blogId={blogPost._id}
              />
            </Col>
          ))}
        </Row>
      </Container>
    ) : (
      <p>No blog posts found.</p>
    )}
  </>
);
}

export default Home;
