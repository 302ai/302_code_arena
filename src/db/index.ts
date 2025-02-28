import Dexie, { Table } from "dexie";
import { History } from "./types";

class CodeArenaDB extends Dexie {
  history!: Table<History>;

  constructor() {
    super("code-arena-db");
    this.version(1).stores({
      history: "id, prompt, type, winner, voted, skip, createdAt",
    });
  }
}

export const db = new CodeArenaDB();
