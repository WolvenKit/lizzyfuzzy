type GithubQuery =
    | { Name: string; Issues: number; Commits: number | null }[]
    | null

type GithubQueryReturn = {
    nodes: [
        nameWithOwner: string,
        issues: {
            totalCount: number
        },
        defaultBranchRef: {
            target: {
                history: {
                    totalCount: number
                }
            }
        } | null
    ]
} | null

type ReturnQuery = {
    Name: string
    Issues: number
    Commits: number | null
} | null

type GitData = {
    nameWithOwner: string
    issues: {
        totalCount: number
    }
    defaultBranchRef: {
        target: {
            history: {
                totalCount: number
            }
        }
    }
}
