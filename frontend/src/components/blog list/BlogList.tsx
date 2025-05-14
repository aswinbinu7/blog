import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AxiosInstance from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (pageNumber: number) => {
    try {
      const response = await AxiosInstance.get(
        `/blogs?page=${pageNumber}&size=4`
      );
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBlog = { title, content };
      const response = await AxiosInstance.post("/blogs/create", newBlog);
      if (response.status === 201 || response.status === 200) {
        alert("Blog added successfully!");
        fetchBlogs(page);
        setTitle("");
        setContent("");
        setShowModal(false);
      }
    } catch (error) {
      alert("Failed to add blog. Please login first.");
      console.error("Add blog error:", error);
    }
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/form");
  };

  const handleBlogClick = (blogId: string) => {
    if (expandedBlog === blogId) {
      setExpandedBlog(null); // Collapse if already expanded
    } else {
      setExpandedBlog(blogId); // Expand the clicked blog
    }
  };

  return (
    <>
      <GlobalStyle />
      <SC_BlogListWrapper>
        <SC_Content>
          <TopBar>
            <h2>All Blogs</h2>
            <div>
              <button onClick={() => navigate("/myblogs")}>My Blogs</button>
              <button onClick={() => setShowModal(true)}>
                Create New Blog
              </button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </TopBar>

          <p>Welcome to the blog section. Below are the latest posts!</p>

          <BlogCards>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
                expanded={expandedBlog === blog.id}
              >
                <h3>{blog.title}</h3>
                <p>
                  {expandedBlog === blog.id
                    ? blog.content
                    : `${blog.content.slice(0, 100)}...`}
                </p>
                <small>Author: {blog.author}</small>
                <small>
                  Date: {new Date(blog.createdAt).toLocaleDateString()}
                </small>
              </BlogCard>
            ))}
          </BlogCards>

          <PaginationWrapper>
            <button onClick={() => setPage(page - 1)} disabled={page === 0}>
              Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 === totalPages}
            >
              Next
            </button>
          </PaginationWrapper>
        </SC_Content>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              <h3>Create New Blog</h3>
              <AddBlogForm onSubmit={handleAddBlog}>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <button type="submit">Add Blog</button>
              </AddBlogForm>
            </ModalContent>
          </ModalOverlay>
        )}
      </SC_BlogListWrapper>
    </>
  );
};

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #fff;
  }
`;

// Styled components
const SC_BlogListWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
  padding: 20px 0;
`;

const SC_Content = styled.div`
  text-align: center;
  padding: 40px 20px;
  margin: auto;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  @media (min-width: 600px) {
    flex-direction: row;
  }

  h2 {
    color: white;
    margin: 0;
  }

  div {
    display: flex;
    gap: 10px;
  }

  button {
    background-color: #ef5350;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const BlogCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const BlogCard = styled.div<{ expanded: boolean }>`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  color: white;
  text-align: left;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease, height 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin-top: 0;
    font-size: 1.4rem;
  }

  p {
    margin: 12px 0;
    font-size: 1rem;
    color: #e0e0e0;
  }

  small {
    display: block;
    font-size: 0.85rem;
    color: #ccc;
    margin-top: 4px;
  }

  height: ${(props) => (props.expanded ? "auto" : "200px")};
  overflow: hidden;
`;

const PaginationWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  button {
    background-color: #1976d2;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;

    &:disabled {
      background-color: #90caf9;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #1565c0;
    }
  }

  span {
    color: white;
    font-weight: bold;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #ffffff;
  color: #333;
  padding: 30px 20px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #1976d2;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: black;
  cursor: pointer;
`;

const AddBlogForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input,
  textarea {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    outline: none;
    resize: vertical;
  }

  textarea {
    min-height: 100px;
  }

  button {
    align-self: center;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background-color: #388e3c;
    }
  }
`;

export default BlogList;
