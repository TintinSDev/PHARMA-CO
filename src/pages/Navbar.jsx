import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/patient-list">Patient List</Link>
        </li>
        <li>
          <Link to="/collection-form">Collection Form</Link>
        </li>
        <li>
          <Link to="/overdue-list">Overdue List</Link>
        </li>
        <li>
          <Link to="/patient-form">Patient Form</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

// const Navbar = ({ isLoggedIn, handleSignOut }) => {
//   return (
//     <nav>
//       <ul>
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/patient-list">Patient List</Link>
//         </li>
//         <li>
//           <Link to="/collection">Collection Form</Link>
//         </li>
//         <li>
//           <Link to="/overdue-list">Overdue List</Link>
//         </li>
//         {isLoggedIn && (
//           <li>
//             <a href="#" onClick={handleSignOut}>
//               Logout
//             </a>
//           </li>
//         )}
//       </ul>
//     </nav>
//   );
// };

// Navbar.propTypes = {
//   isLoggedIn: PropTypes.bool.isRequired,
//   handleSignOut: PropTypes.func.isRequired,
// };

// export default Navbar;
