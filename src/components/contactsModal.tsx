import React, { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

const ContactsModal: React.FC<ContactsModalProps> = ({
  isOpen,
  onClose,
  customerId,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!customerId) return;

    try {
      const response = await fetch(`/api/contacts?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar contatos.");
      }
      const data = await response.json();
      setContacts(data);
      setError(null);
    } catch (error) {
      setError("Erro ao buscar contatos.");
      toast.error("Erro ao buscar contatos.");
    }
  }, [customerId]);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen, fetchContacts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-4xl">
        <h1 className="font-semibold text-[#051723] text-xl mb-4">
          Contatos Vinculados
        </h1>
        <div className="overflow-y-auto max-h-96">
          {error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : contacts.length === 0 ? (
            <p className="text-center text-gray-600">
              Nenhum contato encontrado.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#0A1D27] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Nome Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Telefone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Button
          type="button"
          onClick={onClose}
          className="w-full mt-4 bg-[#051723] text-white hover:bg-[#051723]/90"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default ContactsModal;
