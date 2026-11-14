create table if not exists experience (
  id integer not null primary key autoincrement,
  discordid text not null,
  guildid text not null,
  level integer not null default 1,
  experience integer not null default 0,
  messagecount integer not null default 0
)
