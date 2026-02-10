import React, { useEffect, useState } from "react";
import { getImages } from "../api/dockerApi";
import "./styles/Images.css";

const Images = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages()
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="images-container">
      <h2 className="images-title">Docker Images</h2>

      <table className="images-table">
        <thead>
          <tr>
            <th>Repository</th>
            <th>Image ID</th>
            <th>Size (MB)</th>
          </tr>
        </thead>

        <tbody>
          {images.map(img => (
            <tr className="images-row" key={img.Id}>
              <td>{img.RepoTags ? img.RepoTags.join(", ") : "untagged"}</td>
              <td>{img.Id.substring(7, 19)}</td>
              <td>{(img.Size / 1024 / 1024).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Images;
