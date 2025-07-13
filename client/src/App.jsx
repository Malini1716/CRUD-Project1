import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] =  useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ actor: "", year: "", movies: ""});

 const getAllUsers = async () => {
  const res = await axios.get("http://localhost:8000/users");
  setUsers(res.data);
  setFilterUsers(res.data);
};

  useEffect(() => {
    getAllUsers();
  }, []);

// search function
const handleSearch = (e) => {
  const searchText=e.target.value.toLowerCase();
  const filteredUsers = users.filter(user => user.actor.toLowerCase().includes(searchText) || user.movies.toLowerCase().includes(searchText));
  setFilterUsers(filteredUsers);
};

  // delete function
const handleDelete = async (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this user?");

  if (isConfirmed) {
    await axios.delete(`http://localhost:8000/users/${id}`);
    getAllUsers(); // refresh list
  }
};
//close modal
const closeModal = () => {
  setIsModalOpen(false);
};
//Add user details
const handleAddRecord = () =>{
  setUserData({ actor: "", year: "", movies: ""});//this line is empty if not saved user details
  setIsModalOpen(true);
};
const handleData = (e) => {
  setUserData({...userData,[e.target.name]:e.target.value});
};

//submit user details
// submit user details
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting userData:", userData);
  if (userData.id) {
    await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
  } else {
    await axios.post("http://localhost:8000/users", userData);
  }

  await getAllUsers();   // ✅ refresh local list immediately!

  closeModal();
  setUserData({ actor: "", year: "", movies: "" });
};



// update user function
const handleUpdateRecord = (user) => {
  console.log("Editing user:", user);
  setUserData(user);
  setIsModalOpen(true);
};

return (
  <>
    <div className="container">
      <h3> CRUD application with react.js Frontend and node.js backend</h3>
    </div>
    <div className="input-search">
  <input
    type="search" 
    placeholder="Search Text Here" 
    onChange={handleSearch} 
  />
  <button className="btn green" onClick={handleAddRecord}>Add Record</button>
</div>
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Actor</th>
          <th>year</th>
          <th>Movies</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {filterUsers && 
         filterUsers.map((user,index) => (
          <tr key={user.id}>    
          <td>{index+1}</td>
          <td>{user.actor}</td>
          <td>{user.year}</td>
          <td>{user.movies}</td>
          <td>
            <button className="btn green" onClick={()=>handleUpdateRecord(user)}>Edit</button>
          </td>
          <td>
            <button onClick={()=>handleDelete(user.id)} className="btn red">Delete</button>
          </td>
        </tr>
      ))}      
      </tbody>
    </table>
    {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>&times;</span>
      <h2>User Record</h2>
      <div className="input-group">
        <label htmlFor="actor">Actor Name</label>
        <input type="text" value={userData.actor} name="actor" id="actor" onChange={handleData}/>
      </div>

      <div className="input-group">
        <label htmlFor="year">Year</label>
        <input type="number" value={userData.year} name="year" id="year" onChange={handleData} />
      </div>

      <div className="input-group">
        <label htmlFor="movies">Movies</label>
        <input type="text" value={userData.movies} name="movies" id="movies" onChange={handleData} />
      </div>

      <button className="btn green" onClick={handleSubmit}>
        {userData.id ? "Update User" : "Add User"}
      </button>
    </div>
  </div>
)}

  </>
  );
}  
export default App;