// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./db.sqlite");

type Data = {
  name?: string;
  message?: string;
  notes?: any[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  db.serialize(() => {
    db.run("CREATE TABLE notes (description TEXT)");
  });

  if (req.method === "POST") {
    const statement = db.prepare("INSERT INTO notes (description) VALUES (?)");
    statement.run(req.body.description);
    statement.finalize();
    return res.status(201).json({ message: "success" });
  }

  if (req.method === "GET") {
    db.all("SELECT rowid AS id, description FROM notes", (err, rows) => {
      return res.status(200).json({ notes: rows });
    });
  }

  if (req.method === "DELETE") {
    db.run("DELETE FROM notes WHERE rowid = (?)", req.body.id);
    return res.status(200).json({ message: "success" });
  }

  if (req.method === "PUT") {
    db.run(
      "UPDATE notes SET description = (?) WHERE rowid = (?)",
      req.body.description,
      req.body.id
    );
    return res.status(200).json({ message: "success" });
  }

  // db.serialize(() => {
  //   const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  //   for (let i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  //   }
  //   stmt.finalize();

  //   db.each("SELECT rowid AS id, info FROM lorem", (err, row: any) => {
  //     console.log(row.id + ": " + row.info);
  //   });
  // });

  // res.status(200).json({ name: "John Doe" });
}
