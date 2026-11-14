create table if not exists voicechannel (
  id integer not null primary key autoincrement,
  ownerid text not null,
  channelid text not null,
  createdtime text not null,
  locked integer not null default 0
)
