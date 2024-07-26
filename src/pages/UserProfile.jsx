import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Page_Animation from "../common/Page_Animation";
import Loader from "../components/Loader";
import { UserContext } from "../App";
import Aboutuser from "../components/Aboutuser";
import { filterPageInation } from "../common/FilterPagination";
import InpageNavigation_compo from "../components/InpageNavigation_compo";
import BlogPostCard from "../components/BlogPostCard";
import NodataMessage from "../components/NodataMessage";
import LoadMore_compo from "../components/LoadMore_compo";
import PageNotFound from "./PageNotFound";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
};

const UserProfile = () => {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileLoaded, setProfileloaded] = useState("");

  let {
    userAuth: { username },
  } = useContext(UserContext);

  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
          if(profile !=null){
              setProfile(user[0]);
  
          }
        getBlogs({ user_id: user[0]._id });
        setProfileloaded(profileId)
        setLoading(false);
        // console.log("p")
        // console.log("p",user[0])
        // console.log("pi",user[0]._id)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBlogs = ({ user_id, page = 1 }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        // console.log("p2",data)
        let formateData = await filterPageInation({
          state: blogs,
          data: data.blog,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });
        formateData.user_id = user_id;
        // console.log(formateData);
        setBlogs(formateData);
      });
  };
  useEffect(() => {
    if(profileId !=profileLoaded){
        setBlogs(null)
    }
    if(blogs==null){
        resetState();
        fetchUserProfile();
         
    }
  }, [profileId,blogs]);
  const resetState = () => {
    setProfile(profileDataStructure);
    
    setLoading(true);
    setProfileloaded("")
  };
  return (
    <Page_Animation>
      {loading ? (
        <Loader />
      ) : (
        profile_username.length ?
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className=" flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] md:py-10">
            <img
              src={profile_img}
              alt=""
              className=" w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />
            <h1 className=" text-2xl font-medium ">@{profile_username}</h1>
            <p className=" text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs-{" "}
              {total_reads.toLocaleString()} Reads
            </p>
            <div className=" flex gap-4 mt-2">
              {profileId == username ? (
                <Link
                  to="/setting/edit-profile"
                  className="btn-light rounded-md "
                >
                  Edit Profile
                </Link>
              ) : (
                " "
              )}
            </div>

            {/* a */}
            <Aboutuser
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinAt={joinedAt}
            />
          </div>
          <div className=" max-md:mt-12 w-full">
            <InpageNavigation_compo
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
            >
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
                    return (
                      <Page_Animation
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </Page_Animation>
                    );
                  })
                ) : (
                  <NodataMessage Message={"No blogs Published"} />
                )}
                <LoadMore_compo
                  state={blogs}
                  fetchDatafun={
                     getBlogs
                  }
                />
              </>

               <Aboutuser bio={bio} social_links={social_links} joinAt={joinedAt}/>
            </InpageNavigation_compo>
          </div>
        </section>
        :<PageNotFound/>
      )}
    </Page_Animation>
  );
};

export default UserProfile;
