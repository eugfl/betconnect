import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const createClienteSchema = z.object({
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

export type CreateClienteFormValues = z.infer<typeof createClienteSchema>;

interface CreateClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CreateClienteModal: React.FC<CreateClienteModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClienteFormValues>({
    resolver: zodResolver(createClienteSchema),
  });

  const onSubmit = async (data: CreateClienteFormValues) => {
    try {
      const response = await fetch("/api/costumers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.error("Erro ao criar cliente.");
        }
        return;
      }

      toast.success("Cliente criado com sucesso!");
      onSave();
    } catch (error) {
      toast.error("Erro ao criar cliente.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-md">
        <h1 className="font-semibold text-[#051723]">Criar Cliente</h1>
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

export default CreateClienteModal;
