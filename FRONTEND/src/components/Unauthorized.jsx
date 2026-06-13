import { NavLink } from "react-router";
import { pageBackground, pageWrapper, pageTitleClass, bodyText, primaryBtn } from "../styles/common";

function Unauthorized() {
  return (
    <div className={`${pageBackground} flex items-center justify-center`}>
      <div className={`${pageWrapper} text-center`}>
        <h1 className={`${pageTitleClass} mb-4`}>Access Denied</h1>
        <p className={`${bodyText} mb-8`}>You do not have permission to view this page.</p>
        <NavLink to="/" className={primaryBtn}>
          Back to Home
        </NavLink>
      </div>
    </div>
  );
}

export default Unauthorized;
