"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const updateContactSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      /^\d{2} \d{5}-\d{4}$/,
      "Telefone deve estar no formato 00 00000-0000"
    ),
});

export type UpdateContactFormValues = z.infer<typeof updateContactSchema>;

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  contact: UpdateContactFormValues & { id: string };
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contact,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<UpdateContactFormValues>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: contact,
  });

  React.useEffect(() => {
    if (contact) {
      setValue("fullName", contact.fullName);
      setValue("email", contact.email);
      setValue("phone", contact.phone);
    }
  }, [contact, setValue]);

  const onSubmit = async (data: UpdateContactFormValues) => {
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          if (result.error === "Este email já está em uso.") {
            setError("email", { message: result.error });
          } else {
            toast.error(result.error);
          }
        } else {
          toast.error("Erro ao atualizar contato.");
        }
        return;
      }

      toast.success("Contato atualizado com sucesso!");
      onSave();
    } catch (error) {
      toast.error("Erro ao atualizar contato.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-md">
        <h1 className="font-semibold text-[#051723]">Editar Contato</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Label htmlFor="fullName">Nome Completo:</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Nome Completo"
            className="border border-[#051723]"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}

          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email"
            className="border border-[#051723]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Label htmlFor="phone">Telefone:</Label>
          <Input
            id="phone"
            type="text"
            placeholder="00 00000-0000"
            className="border border-[#051723]"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#051723] text-white hover:bg-[#051723]/90"
          >
            Atualizar
          </Button>
          <Button type="button" onClick={onClose} className="w-full mt-2">
            Fechar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
