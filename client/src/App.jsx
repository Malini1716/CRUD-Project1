import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] =  useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ actor: "", year: "", movies: ""});

  const getAllUsers = async () => {
    try {
      const res = await axios.get("https://9fb12c90-6deb-48f4-b5f7-ab22729d73b9-00-yll31eqehrg0.pike.replit.dev/users");

      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.actor.toLowerCase().includes(searchText) ||
        user.movies.toLowerCase().includes(searchText)
    );
    setFilterUsers(filtered);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      try {
        await axios.delete(`https://9fb12c90-6deb-48f4-b5f7-ab22729d73b9-00-yll31eqehrg0.pike.replit.dev/users/${id}`);

        getAllUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddRecord = () => {
    setUserData({ actor: "", year: "", movies: "" });
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData.id) {
        await axios.patch(`https://9fb12c90-6deb-48f4-b5f7-ab22729d73b9-00-yll31eqehrg0.pike.replit.dev/users/${userData.id}`, userData);

      } else {
        await axios.post("https://9fb12c90-6deb-48f4-b5f7-ab22729d73b9-00-yll31eqehrg0.pike.replit.dev/users", userData);

      }
      await getAllUsers();
      closeModal();
      setUserData({ actor: "", year: "", movies: "" });
    } catch (err) {
      console.error("Error submitting user data:", err);
    }
  };

  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD application with React.js Frontend and Node.js Backend</h3>
      </div>

      <div className="input-search">
        <input
          type="search"
          placeholder="Search Text Here"
          onChange={handleSearch}
        />
        <button className="btn green" onClick={handleAddRecord}>
          Add Record
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Actor</th>
            <th>Year</th>
            <th>Movies</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers &&
            filterUsers.map((user, index) => (
              <tr key={user.id || index}>
                <td>{index + 1}</td>
                <td>{user.actor}</td>
                <td>{user.year}</td>
                <td>{user.movies}</td>
                <td>
                  <button className="btn green" onClick={() => handleUpdateRecord(user)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button className="btn red" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>User Record</h2>

            <div className="input-group">
              <label htmlFor="actor">Actor Name</label>
              <input
                type="text"
                value={userData.actor}
                name="actor"
                id="actor"
                onChange={handleData}
              />
            </div>

            <div className="input-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                value={userData.year}
                name="year"
                id="year"
                onChange={handleData}
              />
            </div>

            <div className="input-group">
              <label htmlFor="movies">Movies</label>
              <input
                type="text"
                value={userData.movies}
                name="movies"
                id="movies"
                onChange={handleData}
              />
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
