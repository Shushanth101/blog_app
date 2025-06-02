import { Card, Button } from 'react-bootstrap';

function BlogCard(props) {
  // Limit body preview length to 100 characters
  const maxLength = 100;
  const preview = props.body.length > maxLength
    ? props.body.substring(0, maxLength) + "..."
    : props.body;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={props.image} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {preview}
        </Card.Text>
        <Button variant="primary" href={`/blog/${props.blogId}`}>
          Visit
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BlogCard;
