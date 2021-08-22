import * as SQLite from "expo-sqlite";

const dbName = "CHAIN.V3.2";

export default class Sqlite {
  #db;

  constructor(onDone) {
    if (Sqlite._instance) {
      if (onDone) onDone();
      return Sqlite._instance;
    }

    this.#createDb(onDone);
    Sqlite._instance = this;
  }

  async #createDb(onDone) {
    let db = SQLite.openDatabase(dbName);
    this.#db = db;

    db.transaction((tx) => {
      tx.executeSql(
        `
          CREATE table if not exists identity (
            identity_id integer primary key not null,
            weight integer not null default 0,
            name text unique not null
          );
        `,
        null,
        () => {},
        (_, error) => {
          console.log("error db identity", error);
        }
      );

      tx.executeSql(
        `
          CREATE table if not exists habit (
            habit_id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            mon INTEGER NOT NULL DEFAULT 0,
            tue INTEGER NOT NULL DEFAULT 0,
            wen INTEGER NOT NULL DEFAULT 0,
            thu INTEGER NOT NULL DEFAULT 0,
            fri INTEGER NOT NULL DEFAULT 0,
            sat INTEGER NOT NULL DEFAULT 0,
            sun INTEGER NOT NULL DEFAULT 0,
            identity_id INTEGER NOT NULL,
            FOREIGN KEY (identity_id)
              REFERENCES identity (identity_id)
              ON DELETE CASCADE
          );
        `,
        null,
        () => {},
        (_, error) => {
          console.log("error db habit", error);
        }
      );

      tx.executeSql(
        `
          CREATE table if not exists habit_repetition (
            repetition_id INTEGER PRIMARY KEY,
            init INTEGER NOT NULL,
            end INTEGER,
            habit_id INTEGER NOT NULL,
            FOREIGN KEY (habit_id)
              REFERENCES habit (habit_id)   
              ON DELETE CASCADE
          );
        `,
        null,
        onDone,
        (_, error) => {
          console.log("error db habit_repetition", error);
        }
      );
    });
  }

  async getIdentities(onDone) {
    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          SELECT * FROM identity
        `,
        null,
        onDone,
        (_, error) => {
          console.log("error getIdentities", error);
        }
      );
    });
  }

  async getHabits(onDone, date = new Date()) {
    date.setHours(0, 0, 0, 0);
    let dayQuerie = "";
    switch (date.getDay()) {
      case 0:
        dayQuerie = "habit.sun = 1";
        break;
      case 1:
        dayQuerie = "habit.mon = 1";
        break;
      case 2:
        dayQuerie = "habit.tue = 1";
        break;
      case 3:
        dayQuerie = "habit.wen = 1";
        break;
      case 4:
        dayQuerie = "habit.thu = 1";
        break;
      case 5:
        dayQuerie = "habit.fri = 1";
        break;
      case 6:
        dayQuerie = "habit.sat = 1";
        break;
    }

    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          SELECT
            habit.name as name,
            habit.habit_id as habit_id,
            identity.name as identity_name,
            identity.weight as identity_weight
          FROM
            habit INNER JOIN
            identity ON habit.identity_id = identity.identity_id
          WHERE 
            ${dayQuerie}
        `,
        [],
        (_, { rows: { _array } }) => onDone(_array),
        (_, error) => {
          console.log("error getHabits", error);
        }
      );
    });
  }

  async getRepetitions(onDone, init = new Date(), end = new Date()) {
    console.log(init, end)
    init.setHours(0, 0, 0, 0);
    end.setHours(24, 0, 0, 0);

    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          SELECT
            habit.habit_id as habit_id,
            habit.name as habit_name,
            identity.identity_id as identity_id,
            identity.name as identity_name,
            identity.weight as identity_weight,
            habit_repetition.init,
            habit_repetition.end
          FROM
            habit INNER JOIN
            identity ON habit.identity_id = identity.identity_id INNER JOIN 
            habit_repetition ON habit_repetition.habit_id = habit.habit_id
          WHERE 
            habit_repetition.init >= ? AND (habit_repetition.end is null OR habit_repetition.end <= ?)
        `,
        [init.getTime(), end.getTime()],
        (_, { rows: { _array } }) => onDone(_array),
        (_, error) => {
          console.log("error getRepetitions", error);
        }
      );
    });
  }

  async createIdentity(identity, onDone) {
    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          INSERT INTO identity (name, weight) values (?, ?)
        `,
        [identity.name, +identity.weight],
        onDone,
        (_, error) => {
          console.log("error createIdentity", error);
        }
      );
    });
  }

  async createHabit(habit, onDone) {
    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          INSERT INTO habit (
            name, 
            identity_id,
            mon,
            tue,
            wen,
            thu,
            fri,
            sat,
            sun
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          habit.name,
          habit.identity_id,
          habit.mon,
          habit.tue,
          habit.wen,
          habit.thu,
          habit.fri,
          habit.sat,
          habit.sun,
        ],
        onDone,
        (_, error) => {
          console.log("error createHabit", error);
        }
      );
    });
  }

  async startHabit(habitId, onDone) {
    const now = new Date();
    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          INSERT INTO habit_repetition (init, habit_id) values (?, ?)
        `,
        [now.getTime(), habitId],
        onDone,
        (_, error) => {
          console.log("error starthabit", error);
        }
      );
    });
  }

  async stopHabit(onDone) {
    const now = new Date();
    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          UPDATE habit_repetition set end = ? where end is null
        `,
        [now.getTime()],
        onDone,
        (_, error) => {
          console.log("error stop habit", error);
        }
      );
    });
  }
}
