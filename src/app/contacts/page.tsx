"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ContactTableRow from "@/components/tableContactRow";
import { useState, useEffect } from "react";
import CreateContactModal from "@/components/createContactModal";
import EditContactModal from "@/components/editContactModal";
import { toast } from "sonner";

export default function Page() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<any[]>([]);
  const [clients, setClients] = useState<{ id: string; fullName: string }[]>(
    []
  );
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  async function fetchContacts() {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar contatos");
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar os contatos.");
    }
  }

  async function fetchClients() {
    try {
      const response = await fetch("/api/costumers");
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar os clientes.");
    }
  }

  useEffect(() => {
    fetchContacts();
    fetchClients();
  }, []);

  const handleEdit = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setSelectedContact(contact);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir contato");
      }
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contato excluído com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar excluir o contato.");
    }
  };

  const handleSaveContact = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    fetchContacts();
  };

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col mx-5 pt-14">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm">Contatos cadastrados: {contacts.length}</p>
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus />
            Cadastrar contato
          </Button>
        </div>
        <Separator className="mb-5 bg-[#0A1D27]" />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#0A1D27]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nome Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => {
                  const formattedPhone = contact.phone
                    ? contact.phone.replace(
                        /(\d{2})(\d{4})(\d{4})/,
                        "($1) $2-$3"
                      )
                    : "Telefone inválido";

                  return (
                    <ContactTableRow
                      key={contact.id}
                      id={contact.id}
                      nomeCompleto={contact.fullName}
                      email={contact.email}
                      telefone={formattedPhone}
                      dataRegistro={contact.dataRegistro}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm opacity-50 text-center mt-3">
          Feito com ❤ por Gabriel Figueiredo
        </p>

        <CreateContactModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleSaveContact}
          clients={clients}
        />

        {selectedContact && (
          <EditContactModal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            contact={selectedContact}
            onSave={handleSaveContact}
          />
        )}
      </div>
    </div>
  );
}
