import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Home = () => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [data, setData] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  console.log(data);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { id } = user;
        const response = await axios.get(
          `http://localhost:8000/user/${id}/role`
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const fetchUserDetails = () => {
      const token = Cookies.get("auth_token");

      if (token) {
        try {
          const decodedToken = atob(token.split(".")[1]);
          const parsedToken = JSON.parse(decodedToken);
          setUser({ id: parsedToken.id });
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("pdf", file);

        await axios.post("http://localhost:8000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setUploadSuccess(true);
        console.log("File uploaded successfully");
        setFile(null);
      } catch (error) {
        setUploadSuccess(false);
        console.error("File upload failed:", error);
      }
    } else {
      console.error("Please select a file");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/pdf");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/update-pdf/${id}`,
        { isApproved: "approved" }
      );

      console.log("Data updated:", response.data);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="home-container">
      {userRole === "user" ? (
        <div className="card">
          <input type="file" name="file" onChange={handleFileChange} />
          <button type="submit" onClick={handleUpload}>
            Upload
          </button>
          {uploadSuccess ? (
            <p>File uploaded successfully & waiting for the approval</p>
          ) : (
            <p></p>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {data.map((item, index) => (
            <div className="card" key={index}>
              <strong>Name:</strong>
              {item.filename}
              <button
                type="submit"
                className={
                  item.isApproved === "pending" ? "btn-orange" : "btn-green"
                }
                onClick={() => handleSubmit(item._id)}
              >
                {item.isApproved === "pending" ? "Approve" : "Approved"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
