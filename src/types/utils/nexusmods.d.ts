type NexusQuery =
    | {
          mods: {
              nodes: [
                  {
                      modId: number
                      name: string
                      version: string
                      downloads: number
                      endorsements: number
                      adultContent: boolean
                      summary: string
                      status: string
                      modCategory: {
                          name: string
                      }
                      pictureUrl: string
                      game: {
                          domainName: string
                      }
                  },
              ]
          }
          userByName: {
              name: string
              modCount: number
              kudos: number
              country: string
              memberId: number
              about: string
              posts: number
              avatar: string
              uniqueModDownloads: number
          }
      }
    | null
    | Error

type NexusQueryResult = {
    Mods: {
        ModId: number
        Name: string
        Version: string
        Downloads: number
        Endorsements: number
        AdultContent: boolean
        Summary: string
        Status: string
        ModCategory: string
        PictureUrl: string
        Game: string
    }[]
    User: {
        Name: string
        ModCount: number
        Avatar: string
        Kudos: number
        Country: string
        UniqueModDownloads: number
        MemberId: number
        About: string
        Posts: number
    }
}
