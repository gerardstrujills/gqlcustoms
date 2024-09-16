import { ProductInput } from "../res/product";

export const validateProduct = (options: ProductInput) => {
  if (
    !options.title ||
    options.title.trim().length < 4 ||
    options.title.length > 255
  ) {
    return [
      {
        field: "title",
        message: "El título debe tener entre 4 y 255 caracteres",
      },
    ];
  }

  if (
    !options.unitOfMeasurement ||
    options.unitOfMeasurement.trim().length < 2 ||
    options.unitOfMeasurement.length > 15
  ) {
    return [
      {
        field: "unitOfMeasurement",
        message: "La medida debe tener entre 2 y 255 caracteres",
      },
    ];
  }

  if (
    !options.materialType ||
    options.materialType.trim().length < 2 ||
    options.materialType.length > 15
  ) {
    return [
      {
        field: "materialType",
        message: "El material debe tener entre 2 y 255 caracteres",
      },
    ];
  }

  if (options.description !== null) {
    if (
      !options.description ||
      options.description.trim().length < 4 ||
      options.description.length > 255
    ) {
      return [
        {
          field: "description",
          message: "La descripción debe tener entre 4 y 255 caracteres",
        },
      ];
    }
  }

  return null;
};
