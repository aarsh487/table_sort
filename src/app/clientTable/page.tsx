"use client";

import { useMemo, useState } from "react";
import { SortOptionsModal } from "@/components/SortOptionsModal";
import { Client, mockClients } from "@/data/clients";



  export type SortableKey = keyof Client;

  export type SortOption = {
    id: SortableKey;
    direction: "asc" | "desc";
  };

export default function Page() {
  const [sorts, setSorts] = useState<SortOption[]>([
    { id: "name", direction: "asc" },
  ]);

  const sortedClients = useMemo(() => {
    return [...mockClients].sort((a, b) => {
      for (let sort of sorts) {
        const { id, direction } = sort;
        let valA = a[id];
        let valB = b[id];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();

        if (valA == null && valB != null) return direction === "asc" ? -1 : 1;
        if (valA != null && valB == null) return direction === "asc" ? 1 : -1;
        if (valA == null && valB == null) continue;

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [sorts]);

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* 🧼 Only the modal here */}
        <SortOptionsModal sorts={sorts} setSorts={setSorts} />
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Updated At</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client) => (
            <tr key={client.id} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{client.id}</td>
              <td className="p-2 border">{client.name}</td>
              <td className="p-2 border">{client.type}</td>
              <td className="p-2 border">{client.email}</td>
              <td className="p-2 border">{client.createdAt.toDateString()}</td>
              <td className="p-2 border">{client.updatedAt.toDateString()}</td>
              <td className="p-2 border">{client.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
