import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/authentication/authenticationSlice";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import HeaderCSS from "../../../assets/styles/dashboards/admin_css/Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email } = useSelector((store) => store.authentication);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const avatarLetter = (name || email || "A").charAt(0).toUpperCase();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleClose();
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <header className={HeaderCSS.header}>
      <div className={HeaderCSS.brand}>
        <i className="fa-solid fa-book-open" style={{ marginRight: 8, fontSize: 18 }}></i>
        <span>CareerGuidance</span>
        <span className={HeaderCSS.badge}>Admin</span>
      </div>

      <div className={HeaderCSS.right}>
        <button className={HeaderCSS.avatarBtn} onClick={handleOpen} aria-label="User menu">
          {avatarLetter}
        </button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ style: { minWidth: 160, borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" } }}
        >
          <MenuItem
            onClick={() => { handleClose(); navigate("/admin/profile"); }}
            style={{ fontFamily: "var(--fontHeading)", fontSize: 14, gap: 10 }}
          >
            <i className="fa-solid fa-user" style={{ color: "#7b1fa2", width: 16 }}></i>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleLogout}
            style={{ fontFamily: "var(--fontHeading)", fontSize: 14, color: "#c62828", gap: 10 }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: 16 }}></i>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}
