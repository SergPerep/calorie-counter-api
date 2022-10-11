import { Router } from "express";
import { ObjectId } from "mongodb";
import { app } from "../../app";
const router = Router();
import sc from "../../utils/statusCodes";
import {
  AppError,
  RecordNotFoundError,
  WrongTypeError,
} from "../errors/appErrors";
import validateDateString from "./validateDateString";
import validateRecordBody from "./validateRecordBody";

// GET RECORDS FOR A DATE
router.get("/", async (req, res, next) => {
  try {
    const recordsColl = app.locals.recordsColl;
    const { date: dateStr } = req.query;
    if (typeof dateStr !== "string")
      throw new WrongTypeError("date", dateStr, "string");
    validateDateString(dateStr);

    const pipeline = [
      {
        $match: { date: dateStr },
      },
      {
        $set: { id: "$_id" },
      },
      {
        $unset: "_id",
      },
    ];
    const aggCursor = recordsColl.aggregate(pipeline);
    const result = [];
    for await (const doc of aggCursor) {
      result.push(doc);
    }

    res.status(sc.OK).json(result);
  } catch (error) {
    next(error);
  }
});

// GET A RECORD
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const recordsColl = app.locals.recordsColl;
    const result = await recordsColl.findOne({ _id: new ObjectId(id) });
    if (!result) throw new RecordNotFoundError(id);
    result.id = result._id;
    delete result._id;
    res.status(sc.OK).json(result);
  } catch (error) {
    next(error);
  }
});

// CREATE A RECORD
router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const recordsColl = app.locals.recordsColl;
    validateRecordBody(body);
    const result = await recordsColl.insertOne({
      date: body.date,
      meal_type: body.meal_type,
      ingredient: body.ingredient,
      fats_per_100: body.fats_per_100,
      carbs_per_100: body.carbs_per_100,
      proteins_per_100: body.proteins_per_100,
      quantity: body.quantity,
      unit: body.unit,
    });
    if (!result.insertedId) throw new AppError("Record was not added");
    res.status(sc.CREATED).json({
      message: `Record created with id=${result.insertedId}`,
      recordId: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE RECORD
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    validateRecordBody(body);
    const recordsColl = app.locals.recordsColl;
    const result = await recordsColl.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          date: body.date,
          meal_type: body.meal_type,
          ingredient: body.ingredient,
          fats_per_100: body.fats_per_100,
          carbs_per_100: body.carbs_per_100,
          proteins_per_100: body.proteins_per_100,
          quantity: body.quantity,
          unit: body.unit,
        },
      }
    );
    if (!result.modifiedCount) throw new RecordNotFoundError(id);
    res.status(sc.OK).json({ message: "Record updated" });
  } catch (error) {
    next(error);
  }
});

// DELETE ALL RECORDS
router.delete("/terminate-all", async (req, res, next) => {
  try {
    const recordsColl = app.locals.recordsColl;
    const result = await recordsColl.deleteMany({});
    if (result.deletedCount === 0) throw new AppError("Nothing was deleted");
    res.status(sc.OK).json({ message: "All records have been deleted" });
  } catch (error) {
    next(error);
  }
});

// DELETE A RECORD
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const recordsColl = app.locals.recordsColl;
    const result = await recordsColl.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new RecordNotFoundError(id);
    res.status(sc.OK).json({ message: "Record has been deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
