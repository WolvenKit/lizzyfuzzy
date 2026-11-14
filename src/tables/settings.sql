create table if not exists features (
  id integer not null primary key autoincrement,
  featureid text not null,
  active integer not null default 1
)
