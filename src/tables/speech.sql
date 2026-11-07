create table if not exists speech (
  id integer not null primary key autoincrement,
  type text not null default "reaction",
  text text not null,
  keywords text not null
)
