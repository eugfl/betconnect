"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TableRow from "@/components/tableRow";
import { useState, useEffect } from "react";
import CreateClienteModal from "@/components/createClientModal";
import EditClienteModal from "@/components/editClientModal";
import ContactsModal from "@/components/contactsModal";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Page() {
  const { data: session } = useSession();
  const [clientes, setClientes] = useState<any[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewContactsModalOpen, setViewContactsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  async function fetchClientes() {
    try {
      const response = await fetch("/api/costumers");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar clientes");
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar os clientes.");
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEdit = (id: string) => {
    const cliente = clientes.find((c) => c.id === id);
    if (cliente) {
      setSelectedCliente(cliente);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/costumers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir cliente");
      }
      setClientes((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente excluído com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar excluir o cliente.");
    }
  };

  const handleSaveCliente = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    fetchClientes();
  };

  const handleViewContacts = (id: string) => {
    setSelectedCustomerId(id);
    setViewContactsModalOpen(true);
  };

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col mx-5 pt-14">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm">Clientes cadastrados: {clientes.length}</p>
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus />
            Cadastrar cliente
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
                    Data de Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Ações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contatos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => {
                  const registrationDateString = cliente.registrationDate;
                  const registrationDate = new Date(registrationDateString);
                  const formattedRegistrationDate = isNaN(
                    registrationDate.getTime()
                  )
                    ? "Data inválida"
                    : format(registrationDate, "dd/MM/yyyy");

                  const formattedPhone = cliente.phone
                    ? cliente.phone.replace(
                        /(\d{2})(\d{4})(\d{4})/,
                        "($1) $2-$3"
                      )
                    : "Telefone inválido";

                  return (
                    <TableRow
                      key={cliente.id}
                      id={cliente.id}
                      nomeCompleto={cliente.fullName}
                      email={cliente.email}
                      telefone={formattedPhone}
                      dataRegistro={formattedRegistrationDate}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewContacts={handleViewContacts}
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

        <CreateClienteModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleSaveCliente}
        />

        {selectedCliente && (
          <EditClienteModal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            cliente={selectedCliente}
            onSave={handleSaveCliente}
          />
        )}

        <ContactsModal
          isOpen={isViewContactsModalOpen}
          onClose={() => setViewContactsModalOpen(false)}
          customerId={selectedCustomerId || ""}
        />
      </div>
    </div>
  );
}
