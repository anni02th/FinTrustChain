import React, { useEffect, useState } from "react";
import { contracts } from "../api/api";
import { useParams } from "react-router-dom";

export default function ContractViewer() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await contracts.get(id);
        setContract(res.data?.data || null);
      } catch (err) {
        setContract(null);
      }
    }
    load();
  }, [id]);

  return (
    <div className="container-max py-12">
      <div className="card p-6 rounded">
        {!contract && <div className="text-gray-400">Contract not found or loading</div>}
        {contract && (
          <div>
            <h2 className="text-xl font-semibold neon-text">Contract #{contract._id || contract.id}</h2>
            <pre className="mt-4 text-sm text-gray-200 whitespace-pre-wrap">{contract.terms}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
