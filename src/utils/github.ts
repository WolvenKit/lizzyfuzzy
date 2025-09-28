import { App } from 'octokit'
import { fromDir, GraphQL } from 'utils'

const key = fromDir('./src/resources/Github', '.private-key.pem') || ''

export const app = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: key,
    auth: {
        id: process.env.GITHUB_APP_ID,
        privateKey: key,
        installationId: process.env.GITHUB_INSTALLATION_ID,
    },
    installationId: process.env.GITHUB_INSTALLATION_ID,
})

export const octokit = await app.getInstallationOctokit(
    Number(process.env.GITHUB_INSTALLATION_ID)
)

export async function Updater() {
    const data = await octokit.graphql(GraphQL().Updater)

    if (!data) return null

    return data
}

export async function GithubQuery(
    author: string | null
): Promise<GithubQuery | undefined> {
    try {
        if (!author) return undefined

        const RedModdingRepos = await octokit.rest.repos.listForUser({
            username: 'wolvenkit',
        })

        const RepoIds = RedModdingRepos.data.map((repo) => {
            return repo.node_id
        })

        const GithubUserByName = await octokit.rest.users.getByUsername({
            username: author,
        })

        const GithubUserId = GithubUserByName.data.node_id
        if (!author) return null

        const data: GithubQueryReturn =
            await octokit.graphql<GithubQueryReturn>(
                GraphQL().GithubUserQuery,
                {
                    author: author,
                    authorId: GithubUserId,
                    repos: RepoIds,
                }
            )

        if (!data) {
            return null
        }

        return data.nodes
            .map((node: any) => {
                const returnData = {
                    Name: node.nameWithOwner,
                    Issues: node.issues.totalCount,
                    Commits: node.defaultBranchRef
                        ? node.defaultBranchRef.target.history.totalCount
                        : null,
                }

                if (
                    node.issues.totalCount === 0 &&
                    (node.defaultBranchRef
                        ? node.defaultBranchRef.target.history.totalCount === 0
                        : true)
                ) {
                    return null
                }

                return returnData
            })
            .filter((node: any) => node !== null) as GithubQuery
    } catch (error) {
        console.error(error)
        return undefined
    }
}
