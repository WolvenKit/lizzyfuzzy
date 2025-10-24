import { GraphQL } from './readFile'
import { errorLog } from './logging'

export async function NexusQuery(username: string | null): Promise<NexusQueryResult | undefined> {
    try {
        if (!username) return undefined
        const UserData = await fetch(process.env.NEXUSMODS_URI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GraphQL().NexusUserQuery,
                variables: JSON.stringify({
                    count: 4,
                    name: username,
                    filter: { author: { value: username, op: 'EQUALS' } },
                    sort: [{ endorsements: { direction: 'DESC' } }],
                }),
            }),
        })

        const data = await UserData.json()

        const Mods = data.data.mods.nodes.map((mod: any) => {
            return {
                ModId: mod.modId,
                Name: mod.name,
                Version: mod.version,
                Downloads: mod.downloads,
                Endorsements: mod.endorsements,
                AdultContent: mod.adultContent,
                Summary: mod.summary,
                Status: mod.status,
                ModCategory: mod.modCategory.name,
                PictureUrl: mod.pictureUrl,
                Game: mod.game.domainName,
            }
        })

        const User = {
            Name: data.data.userByName.name,
            ModCount: data.data.userByName.modCount,
            Avatar: data.data.userByName.avatar,
            Kudos: data.data.userByName.kudos,
            Country: data.data.userByName.country,
            UniqueModDownloads: data.data.userByName.uniqueModDownloads,
            MemberId: data.data.userByName.memberId,
            About: data.data.userByName.about,
            Posts: data.data.userByName.posts,
        }

        return { Mods, User }
    } catch (error) {
        errorLog(error)
        return undefined
    }
}
