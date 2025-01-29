import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{
      backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVl4YLRuGys8mzKu-is9Qe6DrGfXWYaf1gX_sO4Vvx93zLUz93gO86iDdN5Q73-20WjVA&usqp=CAU)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh'
    }}>
      {/* Header */}
      <header className="bg-light py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <strong className="text-primary" style={{ fontSize: '30px' }}>RECLAIM IT</strong>
          <div className="d-flex">
            <Link to="/signup" className="btn btn-primary me-2">Admin Signup</Link>
            <Link to="/login" className="btn btn-primary">Admin Login</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="content p-4 bg-white rounded shadow-sm w-50">
          <section>
            <h2 className="text-primary">Welcome!!</h2>
            <h3 className="text-secondary">Lost It - List It - Find It</h3>
            <p className="text-muted">
              Experience seamless lost and found item management.
            </p>

            {/* Button Links */}
            <div className="btn-container">
              <Link to="/lostfound" className="btn btn-primary mb-2 w-100">Lost/Found Item Report</Link>
              <Link to="/found" className="btn btn-primary mb-2 w-100">Found items</Link>
              <Link to="/lost" className="btn btn-info mb-2 w-100">Lost items</Link>
              <Link to="/result" className="btn btn-info mb-2 w-100">Check for results</Link>
              <Link to="/aboutus" className="btn btn-success mb-2 w-100">About Us</Link>
              <Link to="/contactus" className="btn btn-warning mb-2 w-100">Contact Us</Link>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link to="/submit" className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4">
        <i className="fas fa-plus"></i>
      </Link>

      {/* Footer */}
      <footer className="bg-light py-3 text-center">
        <small>
          <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
        </small>
      </footer>
    </div>
  );
}

export default HomePage;
