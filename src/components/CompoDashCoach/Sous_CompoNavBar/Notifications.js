import React, { useContext, useEffect, useState } from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { IconButton, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {
  collection,
  onSnapshot,
  where,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebase-config";
import { EmailContext } from "../../../contexte/EmailContexte";

function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const { email, setEmail } = useContext(EmailContext);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const isMenuOpenNotif = Boolean(anchorElNotif);

  const menuId = "primary-search-account-menu";
  console.log(email);
  //Fonction pour l'ouverture de l'historique des notifs
  const handleProfileMenuOpenNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
    console.log(notifs);
  };
  const handleMenuClose = () => {
    setAnchorElNotif(null);
    setNewNotificationsCount(0);
    // Stocker les notifications lues dans le stockage local
    const readNotifications = notifs.map((notif) => notif.id);
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(readNotifications)
    );
  };

  const loadNotifications = React.useCallback(() => {
    try {
      const notifCollection = collection(db, "notifications");
      const unsubscribe = onSnapshot(
        query(notifCollection, where("email", "==", email)),
        (snapshot) => {
          const notifData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifs(notifData);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error loading books:", error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    // Récupérer les notifications lues depuis le stockage local
    const readNotifications =
      JSON.parse(localStorage.getItem("readNotifications")) || [];

    // Filtrer les nouvelles notifications qui ne sont pas lues
    const newUnreadNotifications = notifs.filter(
      (notif) => !readNotifications.includes(notif.id)
    );

    // Mettre à jour le compteur de nouvelles notifications
    setNewNotificationsCount(newUnreadNotifications.length);
  }, [notifs]);

  const signalNewNotif = async (date) => {
    // Récupérez la première notification non lue
    const firstUnreadNotif = notifs.find((notif) => notif.timestamp === date);
    console.log(firstUnreadNotif);
    // Si une notification non lue a été trouvée, mettez à jour le document Firestore
    await updateDoc(doc(db, "notifications", firstUnreadNotif.id), {
      newNotif: false,
    });
  };

  const renderMenuNotif = (
    <Menu
      anchorEl={anchorElNotif}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={isMenuOpenNotif}
      onClose={handleMenuClose}
      className="notifsContent"
    >
      <div>
        <h6 className="text-center fw-bold">Notifications</h6>
        <hr />
        <div className="menuItem">
          {notifs.map((notif, index) => (
            <MenuItem
              key={notif.id}
              onClick={() => signalNewNotif(notif.timestamp)}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                {notif.newNotif && (
                  <div className="rounded-circle p-1 bg-primary mx-2"></div>
                )}
                <p
                  className={`notifs px-2 py-2 rounded ${
                    index === notifs.length - 1 ? "last-notification" : ""
                  }`}
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "pre-line",
                    boxShadow: "1.4px 1.4px 1px 1px #3084b5"
                  }}
                >
                  {notif.messageForAdmin}
                </p>
              </div>
            </MenuItem>
          ))}
        </div>
      </div>
    </Menu>
  );

  return (
    <div className="NotifIcone d-flex align-items-center justify-content-center me-2">
      <div className="position-relative">
        <IconButton
          size="large"
          onClick={handleProfileMenuOpenNotif}
          aria-controls={menuId}
          aria-label="show 17 new notifications"
          color=""
          style={{ color: "#3084b5" }}
        >
          {newNotificationsCount > 0 ? (
            <Badge badgeContent={newNotificationsCount} color="error">
              <NotificationsIcon className="fs-3" />
            </Badge>
          ) : (
            <NotificationsIcon className="fs-3" />
          )}
        </IconButton>
      </div>
      {renderMenuNotif}
    </div>
  );
}

export default Notifications;
