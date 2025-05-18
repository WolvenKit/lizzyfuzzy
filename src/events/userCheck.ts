import { event, errorLog } from "utils";

export default event("ready", async ({}, client) => {
  if (process.env.USER_CHECKS !== "true") return;
  try {
    const getGuild = client.guilds.cache.get("717692382849663036");
    const getUsers = await getGuild?.members.fetch();

    if (!getUsers) return;

    const UsersFlags = getUsers
      .map((member) => {
        if (member.user.bot) return;
        return {
          Member: member.user.username,
          Flags: member.user.flags?.toArray(),
        };
      })
      .filter((flags) => flags !== undefined)
      .filter((flags) => flags.Flags && flags.Flags.length > 0)
      .flat();

    // Remove Hypesquad Flags from User
    const User = UsersFlags.map((user) => {
      const H1 = user.Flags
        ? user.Flags.filter(
            (flag) =>
              flag !== "HypeSquadOnlineHouse1" &&
              flag !== "HypeSquadOnlineHouse2" &&
              flag !== "HypeSquadOnlineHouse3" &&
              flag !== "PremiumEarlySupporter" &&
              flag !== "ActiveDeveloper" &&
              flag !== "Hypesquad" &&
              flag !== "VerifiedDeveloper"
          )
        : [];
      // filter users who have no flags anymore
      if (H1.length === 0) return;
      return { Member: user.Member, Flags: H1 };
    }).filter((user) => user !== undefined);

    // await Bun.write("users.json", JSON.stringify(User, null, 2));

    console.log(User.filter((user) => user.Member !== "lilayah"));
  } catch (error) {
    errorLog("[Event Error]", error);
  }
});
