import * as SQLite from "expo-sqlite";

const dbName = "DB.CHAIN.TEST";

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
            name TEXT not null,
            weigth INTEGER NOT NULL DEFAULT 0,
            identity_id INTEGER,
            FOREIGN KEY (identity_id)
              REFERENCES identity (identity_id)
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
          );
        `,
        null,
        onDone,
        (_, error) => {
          console.log("error db habit_repetition", error);
        }
      );

      tx.executeSql(
        `
          ALTER TABLE identity ADD COLUMN weight integer not null default 0
        `,
        null,
        () => {},
        (_, error) => {
          console.log("error db alter identity table", error);
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

  async getHabits(onDone) {
    let today = new Date()
    today.setHours(0, 0, 0, 0);

    this.#db.transaction((tx) => {
      tx.executeSql(
        `
          SELECT
            habit.name as name,
            habit.habit_id as habit_id,
            identity.name as identity_name,
            identity.weight as identity_weight,
            (repetition_id is not null) as started,
            (
              SELECT
                SUM(end) - SUM(init)
              FROM habit_repetition
                WHERE init >= ? and habit_id = habit.habit_id and end is not null
            ) / 60 / 1000 as total_today
          FROM
            habit LEFT JOIN
            identity ON habit.identity_id = identity.identity_id LEFT JOIN (
              SELECT
                habit_id,
                repetition_id
              FROM habit_repetition
              WHERE end is null
            ) habit_repetition ON habit_repetition.habit_id = habit.habit_id
        `,
        [today.getTime()],
        onDone,
        (_, error) => {
          console.log("error getHabits", error);
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
          INSERT INTO habit (name, identity_id) values (?, ?)
        `,
        [habit.name, habit.identity_id],
        onDone,
        (_, error) => {
          console.log("error createHabit", error);
        }
      );
    });
  }

  async startHabit(habitId, onDone) {
    const now = new Date()
    console.log();
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
    const now = new Date()
    console.log();
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
