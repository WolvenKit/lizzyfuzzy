
create table if not exists voicechatcontroller (
  id integer not null primary key autoincrement,
  guildid text not null,
  messageid text not null,
  categoryid text not null,
  moderatorrole text not null,
  minrole text
)
