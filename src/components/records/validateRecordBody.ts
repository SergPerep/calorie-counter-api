import {
  AppError,
  CannotBeNegativeError,
  EmptyFieldError,
  WrongTypeError,
} from "../errors/appErrors";
import sc from "../../utils/statusCodes";
import validateDateString from "./validateDateString";

type Record = {
  date: string;
  meal_type: string;
  ingredient: string;
  fats_per_100: number;
  carbs_per_100: number;
  proteins_per_100: number;
  quantity: number;
  unit: string;
};

const validateRecordBody = (record: Record) => {
  const {
    date,
    meal_type,
    ingredient,
    fats_per_100,
    carbs_per_100,
    proteins_per_100,
    quantity,
    unit,
  } = record;

  // DATE
  validateDateString(date);

  // MEAL TYPE
  if (!meal_type) throw new EmptyFieldError("meal_type");
  if (typeof meal_type !== "string")
    throw new WrongTypeError("meal_type", meal_type, "string");
  const isMealTypeValid = ["breakfast", "lunch", "dinner"].reduce(
    (prevVal, currVal) => currVal === meal_type || prevVal,
    false
  );
  console.log(isMealTypeValid);
  if (!isMealTypeValid)
    throw new AppError(
      `Expected meal_type to be 'breakfast', 'lunch' or 'dinner'. Instead got '${meal_type}' `,
      sc.BAD_REQUEST
    );

  // INGREDIENT
  if (!ingredient) throw new EmptyFieldError("ingredient");
  if (typeof ingredient !== "string")
    throw new WrongTypeError("ingredient", ingredient, "string");

  // FATS, CARBS && PROTEINS
  const nutritionFields = [
    { fieldName: "fats_per_100", fieldValue: fats_per_100 },
    { fieldName: "carbs_per_100", fieldValue: carbs_per_100 },
    { fieldName: "proteins_per_100", fieldValue: proteins_per_100 },
  ];
  nutritionFields.forEach((field) => {
    const { fieldName, fieldValue } = field;
    if (fieldValue === null || fieldValue === undefined)
      throw new EmptyFieldError(fieldName);
    if (typeof fieldValue !== "number")
      throw new WrongTypeError(fieldName, fieldValue, "number");
    if (fieldValue < 0) throw new CannotBeNegativeError(fieldName, fieldValue);
  });

  // QUANTITY
  if (!quantity) throw new EmptyFieldError("quantity");
  if (typeof quantity !== "number")
    throw new WrongTypeError("quantity", quantity, "number");
  if (quantity < 0) throw new CannotBeNegativeError("quantity", quantity);

  // UNIT
  if (!unit) throw new EmptyFieldError("unit");
  if (unit !== "g" && unit !== "ml")
    throw new AppError(
      `Expected 'unit' to be 'g' or 'ml' instead of ${unit}`,
      sc.BAD_REQUEST
    );
};

export default validateRecordBody;
