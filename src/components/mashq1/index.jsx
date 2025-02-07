  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import axios from "axios";
  import React, { useState, useEffect } from "react";
  import AOS from "aos";
  import "aos/dist/aos.css";

  const fetchUsers = (page) => {
    return axios
      .get(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=3`)
      .then((res) => res.data);
  };

  const postApi = (newPost) => {
    return axios
      .post("https://jsonplaceholder.typicode.com/posts", newPost)
      .then((res) => res.data);
  };
  const removeApi = (id) => {
    return axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.data);
  };

  function remove(id) {
    removeApi(id)
      .then(() => {
        alert("Post muvaffaqiyatli o'chirildi!");
      })
      .catch((error) => {
        alert("Xatolik yuz berdi!");
      });
  }
  function Table() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

    let { data: users, isLoading } = useQuery({
      queryKey: ["users", page],
      queryFn: () => fetchUsers(page),
    });

    let postMutation = useMutation(postApi, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        alert("Post muvaffaqiyatli yaratildi!");
      },
    });

    let save = (e) => {
      e.preventDefault();
      postMutation.mutate({ title, body });
      setTitle("");
      setBody("");
    };

    function pilus() {
      if (page > 1) {
        setPage(page - 1);
      }
    }

  function minus() {
    setPage(page + 1);
  }

    return (
      <div className="container mx-auto w-[1000px] p-5">
        <form
          className="mb-7 border p-5 rounded-lg shadow-lg bg-white"
          onSubmit={save}
        >
          <input
            type="text"
            className="border w-full p-2 rounded-md"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="border w-full mt-4 p-2 rounded-md"
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            type="submit"
            className="cursor-pointer mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
          >
            post
          </button>
        </form>
        {isLoading && <p>Loading...</p>}
        <div className="flex flex-wrap gap-5">
          {users?.map((user) => (
            <div
              key={user.id}
              className="border p-4 w-[30%] rounded-lg shadow-md bg-white"
              data-aos="fade-up"
            >
              <h2 className="text-xl font-bold">name: {user.name}</h2>
              <p className="font-bold">email: {user.email}</p>
              <p className="font-bold">id: {user.id}</p>
              <button onClick={e=>{remove(user.id)}} className="cursor-pointer mt-4 w-full border py-2 rounded-md">
                delete
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={pilus}>
            Oldingi
          </button>
          <button onClick={minus}>Keyingi</button>
        </div>
      </div>
    );
  }

  export default Table;
