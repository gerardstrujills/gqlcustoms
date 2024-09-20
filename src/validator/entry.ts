import { EntryInput, EntryUpdateInput } from "../res/entry";

export const validateEntry = (options: EntryInput) => {
  if (!options.quantity || options.quantity < 0) {
    return [
      {
        field: "quantity",
        message: "La cantidad no puede estar vacío",
      },
    ];
  }

  if (!options.price || options.price < 0) {
    return [
      {
        field: "price",
        message: "El precio no puede estar vacío",
      },
    ];
  }

  return null;
};

export const validateUpdateEntry = (options: EntryUpdateInput) => {
  if (!options.quantity || options.quantity < 0) {
    return [
      {
        field: "quantity",
        message: "La cantidad no puede estar vacío",
      },
    ];
  }

  if (!options.price || options.price < 0) {
    return [
      {
        field: "price",
        message: "El precio no puede estar vacío",
      },
    ];
  }

  return null;
};
