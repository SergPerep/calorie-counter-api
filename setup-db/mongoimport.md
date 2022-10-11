# Mongoimport

mongoimport --db calorie_counter --collection records --file "./server/setup-db/datasets.csv" --uri "mongodb+srv://pickyEater:9PnCaGt8zVUlPZVr@cluster0.s0yec.mongodb.net/?retryWrites=true&w=majority" --type csv --columnsHaveTypes --fields="date.string(),meal_type.string(),dish.string(),ingredient.string(),fats_per_100.double(),proteins_per_100.double(),carbs_per_100.double(),quantity.int32(),unit.string()"
