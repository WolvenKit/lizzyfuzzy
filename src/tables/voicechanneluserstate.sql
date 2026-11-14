create table if not exists vcuserstate (
  id integer not null primary key autoincrement,
  userid text not null,
  channelid text not null,
  jointime text not null
)
