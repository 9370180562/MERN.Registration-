import { useState, useEffect } from "react";
import axios from "axios";

function Signup() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const stateCityData = {
    Maharastra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Delhi: ["New Delhi"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
    Telangana: ["Chennai", "Coimbatore", "Madurai"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    Rajastan: ["Jaipur", "Udaipur", "Jodhpur"],
    Uttarpradesh: ["Lucknow", "Kanpur", "Varanasi"],
    WestBangal: ["Kolkata", "Howrah", "Durgapur"],
    Kerla: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
    Madhyapradesh: ["Bhopal", "Indore", "Jabalpur"],
  };

  // Load users from DB on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    
    if (!name.trim() || !mobile.trim() || !state || !city || !address.trim()) {
      alert("All fields are required!");
      return;
    }

    
    if (mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    const newUser = { name, mobile, state, city, address };

    try {
      if (editIndex !== null) {
      
        const userId = users[editIndex]._id; 
        await axios.put(`http://localhost:5000/users/${userId}`, newUser);

        const updatedUsers = [...users];
        updatedUsers[editIndex] = { ...updatedUsers[editIndex], ...newUser };
        setUsers(updatedUsers);
        setEditIndex(null);
      } else {
        
        const res = await axios.post("http://localhost:5000/users", newUser);
        setUsers([...users, res.data]); 
      }

      
      setName("");
      setMobile("");
      setState("");
      setCity("");
      setAddress("");
    } catch (err) {
      console.error(err);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleEdit = (index) => {
    const user = users[index];
    setName(user.name);
    setMobile(user.mobile);
    setState(user.state);
    setCity(user.city);
    setAddress(user.address);
    setEditIndex(index);
  };

  return (
    <div className="d-flex flex-column align-items-center bg-secondary min-vh-100 p-4">
      <div className="bg-white p-3 rounded w-75 mb-4">
        <h2 className="text-center">User Register</h2>
        <form>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                name="name"
                className="form-control rounded-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col">
              <label htmlFor="mobile">
                <strong>Mobile Number</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Number"
                autoComplete="off"
                name="mobile"
                maxLength="10"
                className="form-control rounded-0"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="state">
                <strong>State</strong>
              </label>
              <select
                name="state"
                className="form-control rounded-0"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                }}
              >
                <option value="">Select your state</option>
                {Object.keys(stateCityData).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="col">
              <label htmlFor="city">
                <strong>City</strong>
              </label>
              <select
                name="city"
                className="form-control rounded-0"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
              >
                <option value="">Select your city</option>
                {state &&
                  stateCityData[state].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="address">
              <strong>Address</strong>
            </label>
            <textarea
              name="address"
              placeholder="Enter your full address"
              className="form-control rounded-0"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-success px-4"
              onClick={handleSave}
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      
      <div className="bg-white p-3 rounded w-75">
        <h3 className="text-center">Registered Users</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No users added yet
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Signup;
