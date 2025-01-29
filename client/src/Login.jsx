import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for error message
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:3001/login", { email, password })
            .then((result) => {
                console.log(result);

                // Check if the server response indicates success
                if (result.data.message === "Success") {
                    navigate("/admindashboard");
                } else {
                    setError("Invalid username or password"); // Set error message for invalid credentials
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Something went wrong. Please try again later."); // Handle other errors gracefully
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-25">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-decoration-none">
                        Register
                    </Link>
                </p>
                <p className="text-center mt-2">
                    <Link to="/forgot-password" className="text-decoration-none text-danger">
                        Forgot Password?
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
