// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../components/DataTable";
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const fetchUsers = async () => {
    try {
      setLoading(true);

      console.log("API CALL:", page, debouncedSearch);

      const res = await axios.get(
        `/api/users?page=${page}&limit=10&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}`,
        {
          headers: {
            authorization: "mock-token-123",
          },
        }
      );

      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, sortBy, order]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);
  const totalPages = Math.ceil(total / limit);


  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/logout"); 
    router.push("/login"); 
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
  ];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
    setPage(1);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

     
      <div className="flex justify-between items-center bg-white shadow rounded-lg px-6 py-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>


        <input
          type="text"
          placeholder="Search user..."
          className="border p-2 mb-4"
          value={search}
          onChange={(e) => {
            setPage(1); // reset page
            setSearch(e.target.value);
          }}
        />


        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">

        <DataTable
          columns={columns}
          data={data}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSort={handleSort}      
          sortBy={sortBy}          
          order={order}            
          loading={loading}
        />
      </div>
    </div>
  );
}