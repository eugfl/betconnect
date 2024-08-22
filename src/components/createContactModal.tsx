import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const createContactSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      /^\d{2} \d{5}-\d{4}$/,
      "Telefone deve estar no formato 00 00000-0000"
    ),
  customerId: z.string().min(1, "ID do cliente é obrigatório"),
});

export type CreateContactFormValues = z.infer<typeof createContactSchema>;

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  clients: { id: string; fullName: string }[];
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContactFormValues>({
    resolver: zodResolver(createContactSchema),
  });

  const onSubmit = async (data: CreateContactFormValues) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Erro ao criar contato.");
        return;
      }

      toast.success("Contato criado com sucesso!");
      onSave();
    } catch (error) {
      toast.error("Erro ao criar contato.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-md">
        <h1 className="font-semibold text-[#051723]">Criar Contato</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Label htmlFor="fullName">Nome Completo:</Label>
          <Input
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
            type="text"
            placeholder="Telefone"
            className="border border-[#051723]"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          <Label htmlFor="customerId">Cliente:</Label>
          <select
            id="customerId"
            {...register("customerId")}
            className="border border-[#051723] rounded p-2 w-full"
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.fullName}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-500 text-sm">{errors.customerId.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#051723] text-white hover:bg-[#051723]/90"
          >
            Criar
          </Button>
          <Button type="button" onClick={onClose} className="w-full mt-2">
            Fechar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;
