import { SupplierInput } from "../res/supplier";

export const validateSupplier = ({
  name,
  address,
  district,
  province,
  department,
}: SupplierInput) => {
  if (!(name.length > 0)) {
    return [
      {
        field: "name",
        message: "La razón social no puede estar vacío",
      },
    ];
  }

  if (name.length > 250) {
    return [
      {
        field: "name",
        message: "La razón social debe contener menos de 250 caracteres",
      },
    ];
  }

  if (address !== null && address !== undefined) {
    if (address.length > 250) {
      return [
        {
          field: "address",
          message: "La dirección debe contener menos de 250 caracteres",
        },
      ];
    }
  }

  if (district !== null && district !== undefined) {
    if (district.length > 250) {
      return [
        {
          field: "district",
          message: "El distrito debe contener menos de 250 caracteres",
        },
      ];
    }
  }

  if (province !== null && province !== undefined) {
    if (province.length > 250) {
      return [
        {
          field: "province",
          message: "La provincia debe contener menos de 250 caracteres",
        },
      ];
    }
  }

  if (department !== null && department !== undefined) {
    if (department.length > 250) {
      return [
        {
          field: "department",
          message: "El departamento debe contener menos de 250 caracteres",
        },
      ];
    }
  }

  return null;
};
