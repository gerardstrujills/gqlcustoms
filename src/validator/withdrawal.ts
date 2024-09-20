import { WithdrawalInput, WithdrawalUpdateInput } from "../res/withdrawal";

export const validateWithdrawal = (options: WithdrawalInput) => {
  if (!options.productId || options.productId < 0) {
    return [
      {
        field: "quantity",
        message: "El productId no puede estar vacío",
      },
    ];
  }

  if (!options.quantity || options.quantity < 0) {
    return [
      {
        field: "quantity",
        message: "La cantidad no puede estar vacío",
      },
    ];
  }

  if (options.title.length <= 3) {
    return [
      {
        field: "title",
        message: "Su proyecto debe tener más caracteres",
      },
    ];
  }

  return null;
};

export const validateUpdateWithdrawal = (options: WithdrawalUpdateInput) => {
  if (!options.quantity || options.quantity < 0) {
    return [
      {
        field: "quantity",
        message: "La cantidad no puede estar vacío",
      },
    ];
  }

  if (options.title.length <= 3) {
    return [
      {
        field: "title",
        message: "Su proyecto debe tener más caracteres",
      },
    ];
  }

  return null;
};
