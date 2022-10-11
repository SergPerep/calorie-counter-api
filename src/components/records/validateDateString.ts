import date from "date-and-time";
import { AppError, EmptyFieldError, WrongTypeError } from "../errors/appErrors";
import sc from "../../utils/statusCodes";
const validateDateString = (dateStr: string) => {
  if (!dateStr) throw new EmptyFieldError("date");
  if (typeof dateStr !== "string")
    throw new WrongTypeError("date", dateStr, "string");
  const isValid = date.isValid(dateStr, "YYYY-MM-DD");
  if (!isValid)
    throw new AppError(
      `Expected date to have format YYYY-MM-DD instead of ${dateStr}`,
      sc.BAD_REQUEST,
      "Wrong date format"
    );
};

export default validateDateString;
