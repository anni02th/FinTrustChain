import React, { useEffect, useState } from "react";
import { notifications } from "../api/api";

export default function Notifications(){
  const [items, setItems] = useState([]);

  useEffect(()=>{
    async function load(){
      try{
        const res = await notifications.list({ userId: localStorage.getItem('userId') });
        setItems(res.data?.data || []);
      }catch(err){
        setItems([]);
      }
    }
    load();
  },[])

  return (
    <div className="container-max py-12">
      <h2 className="text-2xl neon-text font-semibold">Notifications</h2>
      <div className="mt-4 grid gap-3">
        {items.length===0 && <div className="card p-4">No notifications</div>}
        {items.map(n=> (
          <div key={n._id || n.id} className="card p-3 rounded">
            <div className="text-sm text-gray-300">{n.title}</div>
            <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            <div className="mt-2">{n.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
