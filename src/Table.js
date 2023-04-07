import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import axios from "axios";
import ReadTable from "./ReadTable";

function Table() {
  const [searchquery, setSearchquery] = useState("");
  const [posts, setPosts] = useState([]);
  
  //dropdown state
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(null);



//sorting state
  const [sortType, setSortType] = useState("default");
 const [editPostId, setEditPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    id: "",
  });
  useEffect(() => {
    sortData();
  }, [sortType]);
  //edit data
  const handleEditChange = (input) => (e) => {
    e.preventDefault();
    setEditFormData({ ...editFormData, [input]: e.target.value });
  };

  // edit model data
  const handleEditPostForm = (e, post) => {
    e.preventDefault();

    setEditPostId(post.id);
    const formValues = {
      name: post.name,
      id: post.id,
    };
    setEditFormData(formValues);
  };

  //save form data
  const handleFormSave = (e) => {
    e.preventDefault();
    const savePost = {
      name: editFormData.name,
      id: editFormData.id,
    };
    const newPosts = [...posts];
    const formIndex = posts.findIndex((post) => post.id === editPostId);
    newPosts[formIndex] = savePost;
    setPosts(newPosts);
    setEditPostId(null);
  };

  // delete data
  const handleDelete = (e) => {
    e.preventDefault();
    const newPosts = [...posts];
    const formIndex = posts.findIndex((post) => post.id === editPostId);

    // print data in console
    let printdataconsole = newPosts.splice(formIndex, 1);
    console.log("delete data ");
    console.log(printdataconsole);

    setPosts(newPosts);
  };

  //search fillter data
  function search(posts) {
    return posts.filter((row) =>
      row.name.toLowerCase().indexOf(searchquery > -1)
    );
  }
  //sorting data

  function sortData() {
    let sortedData;
    if (sortType === "descending") {
      sortedData = [...posts].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else if (sortType === "ascending") {
      sortedData = [...posts].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else {
      return posts;
    }
    setPosts(sortedData);
  }

  const fetchUrl =
    "https://api.postman.com/collections/24582109-37d97559-22b0-42e0-b592-7fd8b90b8e01?access_key=PMAT-01GXAEX88FNRZN45AWACQ2V20F";
  
    useEffect(() => {
    let unmounted = false;
    async function fetchData() {
      const data = await axios.get(fetchUrl);
      setPosts(
        data.data.collection.item.filter((item) =>
          item.name.toLowerCase().includes(searchquery)
        )
      );
      // setDrop(data.data.collection.item);

      // setItems(data.data.collection.item.map(({ name }) => ({ label: name, value: name })));
      
      if (!unmounted) {
        setItems(
          data.data.collection.item.map(({ name,id }) => ({ label: name, value: name, id}))
        );
        setLoading(false);
      }
    
      return () => {
        unmounted = true;
      };
    }
    fetchData();
  }, [searchquery]);

  return (
    <div>
      <form className="row g-3 ms-auto m-8" style={{ margin: "20px" }}>
        <div className="col-auto">
          <input
            type="text"
            className="form-control ms-auto"
            placeholder="search data"
            value={searchquery}
            onChange={(e) => setSearchquery(e.target.value)}
          />
        </div>
      </form>

      {/* //dropdown */}
      <div>
      <select
      disabled={loading}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    >
     <option>
      <h2>All</h2>
      </option> 
      {items.map(({ label, value,id }) => (
        <option key={value} value={id}>
          {label}
        </option>
      ))}
    </select>

      </div>

      {/* //sorting data */}

      <div className="wrapper " style={{ margin: "10px" }}>
        <div className="wrapper__sort-buttons  bg-success">
          <select
            defaultValue="default"
            className=""
            onChange={(e) => setSortType(e.target.value)}
          >
            <option disabled value="default">
              Sort by
            </option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

     {(!value || value === "All") && <table className="table table-bordered border-primary table table-responsible">
        <thead>
          <tr>
            <th scope="col">name</th>
            <th scope="col">id</th>
            <th scope="col">action</th>
          </tr>
        </thead>
        <tbody>
          <ReadTable
            posts={search(posts)}
            handleEditPostForm={handleEditPostForm}
          ></ReadTable>
        </tbody>
      </table>}
       
      {value && posts.map((post)=>{
        if(post.id === value){
          return (
            <table className="table table-bordered border-primary table table-responsible">
        <thead>
          <tr>
            <th scope="col">name</th>
            <th scope="col">id</th>
            <th scope="col">action</th>
          </tr>
        </thead>
        <tbody>
          <ReadTable
            posts={search([post])}
            handleEditPostForm={handleEditPostForm}
          ></ReadTable>
        </tbody>
      </table>
          )
        }
      })}


      {/* Edit modal design */}
      <div
        className="modal fade"
        id="editModalForm"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit row
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSave}>
                <div className="mb-3">
                  <label className="form-label">name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    // placeholder={name}
                    placeholder="name"
                    required
                    value={editFormData.name}
                    onChange={handleEditChange("name")}
                    // disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">id</label>
                  <input
                    type="text"
                    className="form-control"
                    name="id"
                    placeholder="id"
                    required
                    value={editFormData.id}
                    onChange={handleEditChange("id")}
                    disabled
                  />
                </div>

                <div className="modal-footer d-block">
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-success float-end"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDelete}
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-danger float-start"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;