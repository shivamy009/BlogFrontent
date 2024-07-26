import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { filterPageInation } from "../common/FilterPagination";
import Loader from "../components/Loader";
import Page_Animation from "../common/Page_Animation";
import NodataMessage from "../components/NodataMessage";
import NotificationCard from "../components/NotificationCard";
import LoadMore_compo from "../components/LoadMore_compo";

const Notification = () => {
  let {userAuth,setUserAuth,
    userAuth: { access_token,new_notification_available },
  } = useContext(UserContext);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotification] = useState(null);
  let filters = ["all", "like", "comment", "reply"];

  const fetchNotification = ({ page, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/notifications",
        { page, filter, deletedDocCount },
        {
          headers: {
            authorization: `${access_token}`,
          },
        }
      )
      .then(async ({ data: { notifications: data } }) => {
        if(new_notification_available){
              setUserAuth({...userAuth,new_notification_available:false})
        }
        let formatedData = await filterPageInation({
          state: notifications,
          data,
          page,
          countRoute: "/all-notification-count",
          data_to_send: { filter },
          user: access_token,
        });

        setNotification(formatedData);
        // console.log(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (access_token) {
      fetchNotification({ page: 1 });
    }
  }, [access_token, filter]);

  const handleFilter = (e) => {
    let btn = e.target;
    setFilter(btn.innerHTML);
    setNotification(null);
  };
  return (
    <div className=" max-md:hidden ">
      <h1>Recent Notifications</h1>
      <div className=" my-8 flex gap-6">
        {filters.map((filtername, i) => {
          return (
            <button
              className={
                " py-2 " + (filter == filtername ? "btn-dark" : "btn-light")
              }
              key={i}
              onClick={handleFilter}
            >
              {filtername}
            </button>
          );
        })}
      </div>
      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <Page_Animation key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard data={notification} index={i} notificationState={{notifications,setNotification}} />
                </Page_Animation>
              );
            })
          ) : (
            <NodataMessage Message="nothing available" />
          )}

          <LoadMore_compo
            state={notifications}
            fetchDatafun={fetchNotification}
            additionalParams={{
              deletedDocCount: notifications.deletedDocCount,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Notification;
