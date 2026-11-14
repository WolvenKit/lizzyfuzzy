create table if not exists channels (
  id integer not null primary key autoincrement,
  discordid text not null,
  channelid text null,
  initialmessageUser text null,
  initialmessageChannel text null,
  ticketmessage text null,
  userimage text null,
  active integer not null default 1
)
