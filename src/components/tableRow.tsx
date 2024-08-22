"use client";

import React from "react";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

interface TableRowProps {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  dataRegistro: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TableRow({
  id,
  nomeCompleto,
  email,
  telefone,
  dataRegistro,
  onEdit,
  onDelete,
}: TableRowProps) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">{nomeCompleto}</td>
      <td className="px-6 py-4 whitespace-nowrap">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap">{telefone}</td>
      <td className="px-6 py-4 whitespace-nowrap">{dataRegistro}</td>
      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
        <button
          onClick={() => onEdit(id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="w-5 h-5" />
        </button>
      </td>
      <td>
        <Link
          href={""}
          className="px-6 py-4 whitespace-nowrap text-blue-500 hover:text-blue-700"
        >
          Ver contatos
        </Link>
      </td>
    </tr>
  );
}
