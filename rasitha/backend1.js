// frontend/src/App.js
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  const [content, setContent] = useState("");
  const socketRef = useRef(null);
  const contentRef = useRef("");

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    // Connect to backend
    socketRef.current = io("http://localhost:4000");

    // Load document
    socketRef.current.on("load-document", (doc) => {
      setContent(doc || "");
    });

    // Receive updates from others
    socketRef.current.on("receive-changes", (doc) => {
      setContent(doc);
    });

    // Save periodically
    const saveInterval = setInterval(() => {
      socketRef.current.emit("save-document", contentRef.current);
    }, 2000);

    return () => {
      clearInterval(saveInterval);
      socketRef.current.disconnect();
    };
  }, []);

  // Local typing
  const handleChange = (value) => {
    setContent(value);
    if (socketRef.current) socketRef.current.emit("send-changes", value);
  };

  return (
    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      <h2>📝 Real-time Collaborative Editor</h2>
      <p>Open this page in two tabs to test live editing.</p>
      <ReactQuill value={content} onChange={handleChange} />
    </div>
  );
}

export default App;
