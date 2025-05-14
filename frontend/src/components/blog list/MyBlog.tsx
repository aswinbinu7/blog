import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AxiosInstance from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
}

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null); // Track the blog being edited
  const [editTitle, setEditTitle] = useState<string>(""); // For the title field in the modal
  const [editContent, setEditContent] = useState<string>(""); // For the content field in the modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // To toggle the modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await AxiosInstance.get("/blogs/myblogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching my blogs:", error);
    }
  };

  const handleBlogClick = (blogId: string) => {
    if (expandedBlog === blogId) {
      setExpandedBlog(null);
    } else {
      setExpandedBlog(blogId);
    }
  };

  const handleEditClick = (blog: Blog) => {
    // Open the modal and pre-fill it with the blog data
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditContent(blog.content);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (blogId: string) => {
    try {
      await AxiosInstance.delete(`/blogs/${blogId}`);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error("Error deleting the blog:", error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      try {
        await AxiosInstance.put(`/blogs/${editingBlog.id}`, {
          title: editTitle,
          content: editContent,
        });
        // Update the local state with the new blog data
        setBlogs(
          blogs.map((blog) =>
            blog.id === editingBlog.id
              ? { ...blog, title: editTitle, content: editContent }
              : blog
          )
        );
        setIsModalOpen(false); // Close the modal
      } catch (error) {
        console.error("Error updating the blog:", error);
      }
    }
  };

  return (
    <SC_BlogListWrapper>
      <SC_Content>
        <TopBar>
          <h2>My Blogs</h2>
          <div>
            <button onClick={() => navigate("/blogs")}>All Blogs</button>
          </div>
        </TopBar>

        <BlogCards>
          {blogs.map((blog) => (
            <BlogCard key={blog.id}>
              <div className="content" onClick={() => handleBlogClick(blog.id)}>
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
              </div>
              <div className="actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(blog);
                  }}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(blog.id);
                  }}
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </BlogCard>
          ))}
        </BlogCards>
      </SC_Content>

      {/* Modal for Editing Blog */}
      {isModalOpen && editingBlog && (
        <ModalOverlay>
          <ModalContainer>
            <h3>Edit Blog</h3>
            <form onSubmit={handleSubmitEdit}>
              <label>
                Title:
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                Content:
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </SC_BlogListWrapper>
  );
};

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

const BlogCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  color: white;
  text-align: left;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease;

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

  .content {
    flex: 1;
  }

  .actions {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: flex-start;

    button {
      background-color: #ef5350;
      color: white;
      padding: 8px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-weight: bold;
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background-color: #d32f2f;
      }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  color: black;

  h3 {
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  label {
    display: flex;
    flex-direction: column;
  }

  input,
  textarea {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    padding: 10px;
    background-color: #ef5350;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #d32f2f;
    }
  }

  button[type="button"] {
    background-color: #ccc;
    margin-top: 10px;
  }
`;

export default MyBlogs;
