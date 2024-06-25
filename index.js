const express = require("express");
const app = express();
const { readFile, writeFile } = require("fs/promises");
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const mezmures = await readFile("./data/mezmur.json", { encoding: "utf-8" });
  res.json(JSON.parse(mezmures));
});

app.post("/add", async (req, res) => {
  let mezmures = await readFile("./data/mezmur.json", { encoding: "utf-8" });
  if (mezmures.length !== 0) {
    mezmures = JSON.parse(mezmures);
    const mezmur = {
      id: mezmures[mezmures.length - 1].id + 1,
      mezmur_title: req.body.mezmur_title,
      mezmur_lyrics: req.body.mezmur_lyrics,
    };
    const newMezmures = [...mezmures, mezmur];
    const writedMezmures = await writeFile(
      "./data/mezmur.json",
      JSON.stringify(newMezmures)
    );
  } else {
    const mezmur = [
      {
        id: 1,
        mezmur_title: req.body.mezmur_title,
        mezmur_lyrics: req.body.mezmur_lyrics,
      },
    ];
    const writedMezmures = await writeFile(
      "./data/mezmur.json",
      JSON.stringify(mezmur)
    );
  }

  res.json({ message: "Successfully Created Mezmur" });
});

app.put("/edit/:id", async (req, res) => {
  let mezmures = await readFile("./data/mezmur.json", { encoding: "utf-8" });
  mezmures = JSON.parse(mezmures);
  let mezmur = mezmures.findIndex(
    (mezmur) => mezmur.id.toString() === req.params.id.toString()
  );
  if (mezmures.length !== 0) {
    mezmures[mezmur].mezmur_title = req.body.mezmur_title;
    mezmures[mezmur].mezmur_lyrics = req.body.mezmur_lyrics;
    await writeFile("./data/mezmur.json", JSON.stringify(mezmures));
  }
  res.send({ message: "Successfully Updated Mezmur" });
});

app.delete("/delete/:id", async (req, res) => {
  let mezmures = await readFile("./data/mezmur.json", { encoding: "utf-8" });
  mezmures = JSON.parse(mezmures);
  mezmures = mezmures.filter(
    (mezmur) => mezmur.id.toString() !== req.params.id.toString()
  );
  await writeFile("./data/mezmur.json", JSON.stringify(mezmures));
  res.send({ message: "Successfully Deleted Mezmur" });
});

app.listen(3000);
